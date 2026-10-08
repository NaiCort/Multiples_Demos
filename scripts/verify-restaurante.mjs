import assert from "node:assert/strict"
import fs from "node:fs/promises"
import path from "node:path"
import { createRequire } from "node:module"
import { chromium } from "playwright"

const require = createRequire(import.meta.url)
const base = process.env.DEMO_BASE_URL || "http://127.0.0.1:5173"
const output = path.resolve(process.env.DEMO_TEST_OUTPUT || "test-results/restaurante")
const results = []
async function fixtures(context) {
  if (!process.env.DEMO_TEST_FIXTURES) return
  const root = process.env.DEMO_TEST_FIXTURES
  const index = JSON.parse(await fs.readFile(path.join(root, "index.json"), "utf8"))
  await context.route("https://**/*", async route => {
    const entry = index[route.request().url()]
    if (entry) return route.fulfill({ contentType: entry.type, body: await fs.readFile(path.join(root, entry.file)) })
    return route.continue()
  })
}
async function audit(page) {
  await page.addScriptTag({ path: require.resolve("axe-core/axe.min.js") })
  const violations = await page.evaluate(async () => (await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] } })).violations.map(item => ({ id: item.id, nodes: item.nodes.map(node => ({ target: node.target, summary: node.failureSummary })) })))
  assert.deepEqual(violations, [])
}
const dialog = page => page.getByRole("dialog")
const close = async page => { await page.keyboard.press("Escape"); await dialog(page).waitFor({ state: "detached" }) }
const launch = {
  headless: true, ignoreDefaultArgs: ["--hide-scrollbars"],
  ...(process.env.DEMO_BROWSER_EXECUTABLE ? { executablePath: process.env.DEMO_BROWSER_EXECUTABLE } : {}),
  ...(process.env.DEMO_BROWSER_CHANNEL ? { channel: process.env.DEMO_BROWSER_CHANNEL } : {}),
  ...(process.getuid?.() === 0 ? { args: ["--no-sandbox"] } : {}),
}
await fs.mkdir(output, { recursive: true })
const browser = await chromium.launch(launch)
try {
  for (const [width, height, motion] of [[320, 900, "reduce"], [390, 900, "reduce"], [768, 900, "reduce"], [1024, 900, "reduce"], [1440, 900, "reduce"], [390, 640, "no-preference"]]) {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: motion, ...(width < 640 ? { isMobile: true, hasTouch: true } : {}) })
    await fixtures(context)
    const page = await context.newPage()
    const errors = [], failed = [], requests = [], submissions = []
    page.on("pageerror", error => errors.push(error.message))
    page.on("requestfailed", request => failed.push(request.url()))
    page.on("request", request => { requests.push(request.url()); if (["POST", "PUT", "PATCH", "DELETE"].includes(request.method())) submissions.push(request.url()) })
    const checks = []
    try {
      await page.goto(`${base}/restaurante`)
      await page.getByRole("heading", { level: 1 }).waitFor()
      await page.evaluate(async () => { await document.fonts.ready })
      // Las imágenes diferidas solo se solicitan al acercarse a la pantalla.
      for (const image of await page.locator("main img").all()) {
        await image.scrollIntoViewIfNeeded()
        await image.evaluate(img => img.decode())
      }
      await page.waitForFunction(() => [...document.querySelectorAll(".r-featured-item, .r-place-photo")].every(el => Number(getComputedStyle(el).opacity) === 1))
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }))
      assert((await page.title()).includes("Patio 12"))
      assert((await page.locator('link[rel="icon"]').getAttribute("href")).includes("restaurante.svg"))
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, "Desborde horizontal")
      assert.equal(await page.evaluate(() => [...document.images].every(img => img.naturalWidth > 0)), true, "Imagen sin cargar")
      assert.equal(await page.locator(".r-mobile-menu").isVisible(), width < 1280)
      await audit(page)
      await page.screenshot({ path: path.join(output, `restaurante-${width}-${height}-inicio.png`) })
      await page.locator("#carta").scrollIntoViewIfNeeded()
      await page.screenshot({ path: path.join(output, `restaurante-${width}-${height}-carta.png`) })
      if ([390, 1440].includes(width)) {
        if (width < 1280) {
          await page.getByRole("button", { name: "Abrir menú", exact: true }).click()
          for (const key of ["Tab", "Shift+Tab"]) for (let i = 0; i < 8; i++) { await page.keyboard.press(key); assert(await page.evaluate(() => !!document.activeElement?.closest("dialog"))) }
          await audit(page)
          await close(page)
          assert.equal(await page.getByRole("button", { name: "Abrir menú", exact: true }).evaluate(el => el === document.activeElement), true)
          await page.getByRole("button", { name: "Abrir menú", exact: true }).click()
          await dialog(page).getByRole("link", { name: "La carta", exact: true }).click()
          await page.waitForFunction(() => document.activeElement === document.querySelector("#carta h2"))
          checks.push("Menú, teclado, Escape y foco en sección")
        }
        await page.getByRole("button", { name: "Bebidas", exact: true }).click()
        assert.equal(await page.locator(".r-menu-item").count(), 3)
        await page.getByRole("searchbox", { name: "Buscar en la carta" }).fill("cafe")
        assert.equal(await page.locator(".r-menu-item").count(), 1)
        await page.getByRole("searchbox", { name: "Buscar en la carta" }).fill("no existe")
        await page.getByRole("button", { name: "Ver toda la carta", exact: true }).click()
        assert.equal(await page.locator(".r-menu-item").count(), 12)
        checks.push("Categorías, búsqueda sin acentos y resultado vacío")
        await page.locator(".r-menu-list").getByRole("button", { name: "Elegir Hamburguesa Patio", exact: true }).click()
        await dialog(page).getByRole("checkbox", { name: "Queso extra" }).check()
        await dialog(page).getByRole("button", { name: "Aumentar cantidad", exact: true }).click()
        await audit(page)
        await page.screenshot({ path: path.join(output, `restaurante-${width}-${height}-producto.png`) })
        await dialog(page).getByRole("button", { name: "Añadir al pedido · $470", exact: true }).click()
        await page.getByRole("button", { name: "Ver pedido, 2 productos", exact: true }).click()
        await dialog(page).getByRole("button", { name: "Reducir Hamburguesa Patio", exact: true }).click()
        await dialog(page).getByRole("button", { name: "Aumentar Hamburguesa Patio", exact: true }).click()
        await dialog(page).getByRole("button", { name: "Continuar con el pedido", exact: true }).click()
        await dialog(page).getByRole("radio", { name: "Entrega simulada" }).check()
        await dialog(page).getByRole("textbox", { name: "Nombre de ejemplo", exact: true }).fill("")
        assert.equal(await dialog(page).getByRole("button", { name: "Simular pedido · $505", exact: true }).isDisabled(), true)
        await dialog(page).getByRole("textbox", { name: "Nombre de ejemplo", exact: true }).fill("Alex Demo")
        await dialog(page).getByRole("button", { name: "Volver a los platos", exact: true }).click()
        await dialog(page).getByRole("button", { name: "Continuar con el pedido", exact: true }).click()
        await audit(page)
        await page.screenshot({ path: path.join(output, `restaurante-${width}-${height}-pedido.png`) })
        await dialog(page).getByRole("button", { name: "Simular pedido · $505", exact: true }).click()
        await dialog(page).getByRole("heading", { name: "Pedido simulado completado", exact: true }).waitFor()
        await audit(page)
        await dialog(page).getByRole("button", { name: "Empezar otro pedido", exact: true }).click()
        assert.equal(await page.getByRole("button", { name: "Ver pedido, 0 productos", exact: true }).count(), 1)
        checks.push("Producto, extras, cantidades, recogida/entrega, total, confirmación y reinicio")
        await page.locator(".r-menu-list").getByRole("button", { name: "Elegir Pasta de la casa", exact: true }).click()
        await dialog(page).getByRole("button", { name: "Añadir al pedido · $195", exact: true }).click()
        await page.getByRole("button", { name: "Ver pedido, 1 productos", exact: true }).click()
        await dialog(page).getByRole("button", { name: "Quitar Pasta de la casa", exact: true }).click()
        await dialog(page).getByRole("button", { name: "Explorar la carta", exact: true }).click()
        checks.push("Quitar último producto y recuperar carrito vacío")
        await page.locator(".r-hero-actions").getByRole("button", { name: "Reservar mesa", exact: true }).click()
        const date = dialog(page).getByLabel("Fecha de ejemplo", { exact: true })
        await date.selectOption({ index: 1 })
        await dialog(page).getByRole("button", { name: "Ver horarios", exact: true }).click()
        await dialog(page).getByRole("button", { name: "14:30 Disponible", exact: true }).click()
        await dialog(page).getByRole("button", { name: "Cambiar fecha o personas", exact: true }).click()
        await dialog(page).getByLabel("Personas", { exact: true }).selectOption("6")
        await dialog(page).getByRole("button", { name: "Ver horarios", exact: true }).click()
        assert.equal(await dialog(page).getByRole("button", { name: "Simular reserva", exact: true }).isDisabled(), true)
        assert.equal(await dialog(page).getByRole("button", { name: "14:30 Sin mesas para este grupo", exact: true }).isDisabled(), true)
        await dialog(page).getByRole("button", { name: "19:00 Disponible", exact: true }).click()
        await audit(page)
        await page.screenshot({ path: path.join(output, `restaurante-${width}-${height}-reserva.png`) })
        await dialog(page).getByRole("button", { name: "Simular reserva", exact: true }).click()
        await dialog(page).getByRole("heading", { name: "Reserva simulada completada", exact: true }).waitFor()
        await audit(page)
        await dialog(page).getByRole("button", { name: "Probar otra reserva", exact: true }).click()
        assert.equal(await dialog(page).getByRole("button", { name: "Ver horarios", exact: true }).isDisabled(), true)
        await close(page)
        checks.push("Reserva, disponibilidad por grupo, invalidación de horario, confirmación y reinicio")
        await page.getByRole("button", { name: "Ver ubicación de ejemplo", exact: true }).click()
        await audit(page); await close(page)
        await page.getByRole("button", { name: "Preguntar por WhatsApp · demo", exact: true }).click()
        await dialog(page).getByRole("button", { name: "Hola, ¿puedo pedir para recoger?", exact: true }).click()
        await dialog(page).getByText("Simulación completada. No se ha enviado ningún mensaje.", { exact: true }).waitFor()
        await audit(page)
        await dialog(page).getByRole("button", { name: "Elegir otro mensaje", exact: true }).click()
        await close(page)
        checks.push("WhatsApp de restaurante: selección, respuesta y reinicio")
        await page.getByRole("button", { name: "Privacidad de la demo", exact: true }).click()
        await audit(page); await close(page)
        await page.getByRole("button", { name: "Cómo funciona esta demo", exact: true }).click()
        await audit(page); await close(page)
        await page.getByRole("button", { name: "Solicitar un sitio similar", exact: true }).or(page.getByRole("button", { name: "Contactar", exact: true })).click()
        assert.equal(await dialog(page).getByRole("link", { name: /^WhatsApp/ }).count(), 1)
        await close(page)
        checks.push("Ubicación ficticia, privacidad, guía adaptada y contacto real sin enviar mensajes")
      }
      assert.deepEqual(errors, []); assert.deepEqual(failed, []); assert.deepEqual(submissions, [])
      assert.equal(requests.some(url => url.includes("PsicologoApp")), false, "Psicólogo no debe descargarse en esta ruta")
      results.push({ width, height, motion, status: "passed", checks, errors, failed, submissions })
    } finally { await context.close() }
  }
  const context = await browser.newContext()
  await fixtures(context)
  const page = await context.newPage()
  await page.goto(base)
  await page.getByRole("link", { name: /Restaurante/ }).click()
  await page.waitForFunction(() => document.title.includes("Patio 12"))
  assert((await page.title()).includes("Patio 12"))
  await page.reload(); await page.waitForFunction(() => document.title.includes("Patio 12"))
  await page.getByRole("link", { name: "Volver al portafolio de demos", exact: true }).click()
  await page.waitForFunction(() => document.title.includes("Portafolio"))
  assert((await page.title()).includes("Portafolio"))
  results.push({ status: "passed", scenario: "Portada, ruta directa, recarga y retorno" })
  await context.close()
} finally {
  await browser.close()
  await fs.writeFile(path.join(output, "results.json"), JSON.stringify(results, null, 2))
}
console.log(`${results.length} escenarios de Restaurante aprobados. Capturas: ${output}`)
