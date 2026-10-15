import assert from "node:assert/strict"
import fs from "node:fs/promises"
import path from "node:path"
import { spawn } from "node:child_process"
import { createRequire } from "node:module"
import { chromium } from "playwright"
const require = createRequire(import.meta.url)
const managed = process.env.DEMO_START_PREVIEW === "1"
const base = process.env.DEMO_BASE_URL || (managed ? "http://127.0.0.1:4173" : "http://127.0.0.1:5173")
const output = path.resolve(process.env.DEMO_TEST_OUTPUT || "test-results/restaurante")
const results = []
let server, browser
const dialog = page => page.getByRole("dialog")
const close = async page => { await page.keyboard.press("Escape"); await dialog(page).waitFor({ state: "detached" }) }
async function audit(page) {
  // Medir el estado final, después de las entradas animadas de 450 ms.
  await page.waitForFunction(() => [...document.querySelectorAll('[style*="opacity"]')].every(el => {
    const opacity = Number(getComputedStyle(el).opacity)
    return opacity === 0 || opacity >= 0.999
  }))
  await page.addScriptTag({ path: require.resolve("axe-core/axe.min.js") })
  const violations = await page.evaluate(async () => (await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] } })).violations.map(item => ({ id: item.id, nodes: item.nodes.map(node => ({ target: node.target, summary: node.failureSummary })) })))
  assert.deepEqual(violations, [])
}
async function bounds(page) {
  await page.waitForFunction(() => document.documentElement.scrollWidth <= innerWidth, null, { timeout: 2000 })
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, "Desborde horizontal")
  if (await page.locator(".r-timer").count()) await page.waitForFunction(() => { const b = document.querySelector(".r-timer")?.getBoundingClientRect(); return !b || b.left >= 0 && b.top >= 0 && b.right <= document.documentElement.clientWidth + 1 && b.bottom <= innerHeight + 1 }, null, { timeout: 2000 })
  if (await page.locator(".r-timer").count()) assert.equal(await page.locator(".r-timer").evaluate(el => { const b = el.getBoundingClientRect(); return b.left >= 0 && b.top >= 0 && b.right <= document.documentElement.clientWidth + 1 && b.bottom <= innerHeight + 1 }), true, "Contador fuera de pantalla")
}
async function choose(page, mode = "Comer aquí") { await dialog(page).getByRole("button", { name: mode, exact: true }).click() }
async function fixture(context) {
  if (!process.env.DEMO_TEST_FIXTURES) return
  const root = process.env.DEMO_TEST_FIXTURES
  const index = JSON.parse(await fs.readFile(path.join(root, "index.json"), "utf8"))
  await context.route("https://**/*", async route => { const entry = index[route.request().url()]; if (entry) return route.fulfill({ contentType: entry.type, body: await fs.readFile(path.join(root, entry.file)) }); return route.continue() })
}
async function contextFor(options = {}) {
  const context = await browser.newContext({ reducedMotion: "reduce", ...options })
  await fixture(context)
  const page = await context.newPage(), errors = [], failed = [], submissions = []
  page.on("pageerror", error => errors.push(error.message))
  page.on("requestfailed", request => {
    // Navegar o recargar puede cancelar una fuente que todavía se descarga.
    if (request.failure()?.errorText !== "net::ERR_ABORTED") failed.push({ url: request.url(), error: request.failure()?.errorText })
  })
  page.on("request", request => { if (["POST", "PUT", "PATCH", "DELETE"].includes(request.method())) submissions.push(request.url()) })
  return { context, page, errors, failed, submissions }
}
function clean(run) { assert.deepEqual(run.errors, []); assert.deepEqual(run.failed, []); assert.deepEqual(run.submissions, []) }
await fs.mkdir(output, { recursive: true })
try {
  if (managed) {
    server = spawn(process.execPath, [path.join(path.dirname(require.resolve("vite/package.json")), "bin/vite.js"), "preview", "--host", "127.0.0.1", "--port", "4173", "--strictPort"], { stdio: "ignore" })
    let started = false
    for (let i = 0; i < 100; i++) { try { if ((await fetch(base)).ok) { started = true; break } } catch { /* Esperar inicio del servidor local de pruebas. */ } await new Promise(resolve => setTimeout(resolve, 100)) }
    assert(started, "No inició la vista previa")
  }
  browser = await chromium.launch({ headless: true, ignoreDefaultArgs: ["--hide-scrollbars"], ...(process.env.DEMO_BROWSER_EXECUTABLE ? { executablePath: process.env.DEMO_BROWSER_EXECUTABLE } : {}), ...(process.env.DEMO_BROWSER_CHANNEL ? { channel: process.env.DEMO_BROWSER_CHANNEL } : {}), ...(process.getuid?.() === 0 ? { args: ["--no-sandbox"] } : {}) })
  for (const [width, height, motion] of [[320, 740, "reduce"], [390, 844, "reduce"], [768, 900, "reduce"], [1024, 900, "reduce"], [1440, 900, "reduce"], [390, 640, "no-preference"]]) {
    const run = await contextFor({ viewport: { width, height }, reducedMotion: motion, ...(width < 640 ? { isMobile: true, hasTouch: true } : {}) })
    const { page, context } = run
    try {
      await page.goto(`${base}/restaurante`)
      await dialog(page).getByRole("heading", { name: "Bienvenido al patio", exact: true }).waitFor()
      await audit(page); await bounds(page)
      await page.screenshot({ path: path.join(output, `entrada-${width}-${height}.png`) })
      await choose(page)
      await dialog(page).getByRole("heading", { name: "Estamos preparando tu mesa.", exact: true }).waitFor()
      await audit(page)
      await dialog(page).getByRole("button", { name: "Explorar la carta mientras espero", exact: true }).click()
      await page.locator(".r-menu-list").getByRole("button", { name: "Elegir Pasta de la casa", exact: true }).click()
      assert.equal(await dialog(page).getByRole("button", { name: "Añadir al pedido · $195", exact: true }).isDisabled(), true)
      await audit(page); await close(page)
      await page.locator(".r-timer").getByRole("button", { name: "Saltar espera desde el contador", exact: true }).click()
      const table = await page.evaluate(() => JSON.parse(localStorage.getItem("patio12-demo-v1")).visit.table)
      assert(table >= 1 && table <= 25)
      await page.getByRole("button", { name: "Entendido", exact: true }).click()
      // Cargar las fotografías diferidas y verificar sus recursos locales reales.
      for (const image of await page.locator("main img").all()) { await image.scrollIntoViewIfNeeded(); await image.evaluate(img => img.decode()) }
      await bounds(page); await audit(page)
      assert.equal(await page.locator(".r-menu-item").count(), 12)
      assert.equal(await page.evaluate(() => [...document.images].every(img => img.naturalWidth > 0)), true)
      await page.locator("#carta").scrollIntoViewIfNeeded()
      await page.screenshot({ path: path.join(output, `carta-${width}-${height}.png`) })
      await page.locator(".r-timer").getByRole("button", { name: "Elegir esquina del contador", exact: true }).click()
      await page.locator(".r-timer").getByRole("button", { name: "Superior izquierda", exact: true }).click(); await bounds(page)
      await page.locator(".r-timer").getByRole("button", { name: "Minimizar contador", exact: true }).click(); await bounds(page)
      await page.screenshot({ path: path.join(output, `miniatura-${width}-${height}.png`) })
      await page.getByRole("link", { name: "Volver al portafolio de demos", exact: true }).click()
      await page.waitForFunction(() => document.title.includes("Portafolio"))
      assert(await page.locator(".r-timer-compact").isVisible())
      await page.reload(); await page.locator(".r-timer-compact").waitFor()
      await page.locator(".r-timer-open").click(); await dialog(page).getByRole("heading", { name: `Mesa ${table}`, exact: true }).waitFor()
      assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem("patio12-demo-v1")).visit.table), table)
      await dialog(page).getByRole("button", { name: "Elegir mi comida", exact: true }).click()
      await page.locator(".r-menu-list").getByRole("button", { name: "Elegir Ensalada del patio", exact: true }).click()
      await dialog(page).getByRole("button", { name: "Foto siguiente de Ensalada del patio", exact: true }).click()
      assert((await dialog(page).locator(".r-gallery-frame img").getAttribute("src")).includes("ensalada-2"))
      await dialog(page).getByLabel("Cantidad de Vinagreta de limón", { exact: true }).selectOption("none")
      await dialog(page).getByRole("checkbox", { name: "Pollo a la plancha" }).check()
      await dialog(page).getByText("Con carne", { exact: true }).waitFor()
      await audit(page); await page.screenshot({ path: path.join(output, `producto-${width}-${height}.png`) })
      await dialog(page).getByRole("button", { name: "Añadir al pedido · $170", exact: true }).click()
      await page.getByRole("button", { name: "Ver pedido, 1 productos", exact: true }).click()
      assert((await dialog(page).innerText()).includes("Sin este ingrediente: Vinagreta de limón"))
      await dialog(page).getByRole("button", { name: "Editar Ensalada del patio", exact: true }).click()
      await dialog(page).getByRole("checkbox", { name: "Pollo a la plancha" }).uncheck()
      await dialog(page).getByRole("button", { name: "Guardar cambios · $125", exact: true }).click()
      await page.getByRole("button", { name: "Ver pedido, 1 productos", exact: true }).click()
      await dialog(page).getByRole("button", { name: "Continuar con el pedido", exact: true }).click()
      await dialog(page).getByRole("button", { name: "Simular pedido · $125", exact: true }).click()
      await dialog(page).getByRole("heading", { name: "En preparación", exact: true }).waitFor()
      await audit(page)
      await dialog(page).getByRole("button", { name: "Avanzar simulación", exact: true }).click()
      await dialog(page).getByRole("button", { name: "Terminar visita de ejemplo", exact: true }).click()
      await dialog(page).getByRole("heading", { name: "Visita finalizada", exact: true }).waitFor()
      assert.equal(await page.locator(".r-timer").count(), 0)
      clean(run)
      results.push({ scenario: "Modalidad, espera, fotos, configuración, edición, mesa única, miniatura, retorno, pedido y cierre", width, height, motion, status: "passed" })
    } finally { await context.close() }
  }
  {
    const run = await contextFor({ viewport: { width: 1440, height: 900 } }); const { page, context } = run
    try {
      await page.clock.install(); await page.goto(`${base}/restaurante`); await choose(page)
      await dialog(page).getByRole("button", { name: "Explorar la carta mientras espero", exact: true }).click()
      await page.clock.fastForward(60_100)
      assert((await page.locator(".r-timer-main").innerText()).includes("Mesa"))
      await page.locator(".r-timer").getByRole("button", { name: "Elegir esquina del contador", exact: true }).click(); await page.locator(".r-timer").getByRole("button", { name: "Superior izquierda", exact: true }).click()
      // Dejar que ResizeObserver y el reloj instrumentado apliquen el nuevo tamaño/posición.
      await page.clock.runFor(100)
      const handle = await page.locator(".r-timer-grip").boundingBox()
      await page.mouse.move(handle.x + 10, handle.y + 10); await page.mouse.down(); await page.mouse.move(handle.x + 210, handle.y + 110, { steps: 8 }); await page.mouse.up()
      await page.waitForFunction(() => { const widget = JSON.parse(localStorage.getItem("patio12-demo-v1")).widget; return widget.x > 0 && widget.y > 0 })
      const moved = await page.evaluate(() => JSON.parse(localStorage.getItem("patio12-demo-v1")).widget)
      assert(moved.x > 0); assert(moved.y > 0); await bounds(page)
      await page.setViewportSize({ width: 320, height: 640 }); await bounds(page)
      await page.reload(); await page.locator(".r-timer").waitFor(); await bounds(page)
      clean(run); results.push({ scenario: "Minuto automático, arrastre, límites, cambio de tamaño y posición guardada", status: "passed" })
    } finally { await context.close() }
  }
  {
    const run = await contextFor({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }); const { page, context } = run
    try {
      await page.goto(`${base}/restaurante`); await choose(page, "A domicilio")
      await page.getByRole("button", { name: "Mi perfil · demo", exact: true }).click(); await dialog(page).getByRole("checkbox", { name: "Usar perfil de ejemplo" }).check(); await close(page)
      await page.locator(".r-menu-list").getByRole("button", { name: "Elegir Hamburguesa Patio", exact: true }).click(); await dialog(page).getByRole("button", { name: "Añadir al pedido · $215", exact: true }).click()
      await page.getByRole("button", { name: "Ver pedido, 1 productos", exact: true }).click(); await dialog(page).getByRole("button", { name: "Continuar con el pedido", exact: true }).click()
      await dialog(page).getByLabel(/^Zona de entrega de ejemplo/).selectOption("centro")
      await dialog(page).getByRole("radio", { name: /^Pago digital · simulado/ }).check()
      await dialog(page).getByRole("textbox", { name: "Dirección de ejemplo", exact: true }).fill("")
      assert(await dialog(page).getByRole("button", { name: "Simular pedido · $239", exact: true }).isDisabled())
      await dialog(page).getByRole("textbox", { name: "Dirección de ejemplo", exact: true }).fill("Avenida ficticia 25")
      await audit(page); await page.screenshot({ path: path.join(output, "entrega-beneficios.png") })
      await dialog(page).getByRole("button", { name: "Simular pedido · $239", exact: true }).click(); await dialog(page).getByRole("heading", { name: "En preparación", exact: true }).waitFor()
      const reference = await page.evaluate(() => JSON.parse(localStorage.getItem("patio12-demo-v1")).order.id)
      await page.reload(); await dialog(page).getByRole("heading", { name: "En preparación", exact: true }).waitFor()
      assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem("patio12-demo-v1")).order.id), reference)
      await dialog(page).getByRole("button", { name: "Avanzar simulación", exact: true }).click(); await dialog(page).getByRole("heading", { name: "En camino", exact: true }).waitFor()
      await dialog(page).getByRole("button", { name: "Avanzar simulación", exact: true }).click(); await dialog(page).getByRole("button", { name: "Finalizar entrega de ejemplo", exact: true }).click()
      await dialog(page).getByRole("button", { name: "Perfil y recibos de ejemplo", exact: true }).click(); assert((await dialog(page).innerText()).includes("4 visitas de ejemplo"))
      await dialog(page).getByRole("button", { name: new RegExp(reference) }).click(); await dialog(page).getByRole("button", { name: "Vista del correo de ejemplo", exact: true }).click()
      assert((await dialog(page).innerText()).includes("alex@example.invalid")); await audit(page)
      await page.screenshot({ path: path.join(output, "perfil-recibo.png") }); clean(run)
      results.push({ scenario: "Entrega por zona, validación, pago ficticio, descuento, recarga, recibo y una visita de fidelidad", status: "passed" })
    } finally { await context.close() }
  }
  {
    const run = await contextFor(); const { page, context } = run
    try {
      await page.goto(`${base}/restaurante`); await choose(page, "Para llevar")
      await page.getByRole("button", { name: "Bebidas", exact: true }).click(); await page.getByRole("searchbox", { name: "Buscar en la carta", exact: true }).fill("cafe"); assert.equal(await page.locator(".r-menu-item").count(), 1)
      await page.getByRole("searchbox", { name: "Buscar en la carta", exact: true }).fill("inexistente"); await page.getByRole("button", { name: "Ver toda la carta", exact: true }).click()
      await page.getByLabel(/^Preferencia/).selectOption("meat"); assert.equal(await page.locator(".r-menu-item").count(), 2)
      await page.locator(".r-hero-actions").getByRole("button", { name: "Reservar mesa", exact: true }).click()
      await dialog(page).getByLabel("Fecha de ejemplo", { exact: true }).selectOption({ index: 1 }); await dialog(page).getByRole("button", { name: "Ver horarios", exact: true }).click(); await dialog(page).getByRole("button", { name: "14:30 Disponible", exact: true }).click()
      await dialog(page).getByRole("button", { name: "Cambiar fecha o personas", exact: true }).click(); await dialog(page).getByLabel("Personas", { exact: true }).selectOption("6"); await dialog(page).getByRole("button", { name: "Ver horarios", exact: true }).click()
      assert(await dialog(page).getByRole("button", { name: "Simular reserva", exact: true }).isDisabled()); await dialog(page).getByRole("button", { name: "19:00 Disponible", exact: true }).click(); await audit(page); await close(page)
      await page.getByRole("button", { name: "Privacidad de la demo", exact: true }).click(); await audit(page); await close(page)
      clean(run); results.push({ scenario: "Filtros combinados, búsqueda sin acentos, reserva futura y privacidad", status: "passed" })
    } finally { await context.close() }
  }
  {
    const run = await contextFor({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
    const { page, context } = run
    try {
      await page.goto(`${base}/restaurante`); await choose(page)
      await dialog(page).getByRole("button", { name: "Explorar la carta mientras espero", exact: true }).click()
      const cdp = await context.newCDPSession(page)
      const swipe = async (x, y, endX, endY) => {
        await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] })
        for (let step = 1; step <= 8; step++) await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x + (endX - x) * step / 8, y: y + (endY - y) * step / 8 }] })
        await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] })
      }
      const grip = await page.locator(".r-timer-grip").boundingBox()
      await swipe(grip.x + 15, grip.y + 15, grip.x - 70, grip.y - 65)
      await page.waitForFunction(() => { const widget = JSON.parse(localStorage.getItem("patio12-demo-v1")).widget; return widget.x < 1 && widget.y < 1 })
      const position = await page.evaluate(() => JSON.parse(localStorage.getItem("patio12-demo-v1")).widget)
      assert(position.x < 1 && position.y < 1); await bounds(page)
      await page.locator(".r-menu-list").getByRole("button", { name: "Elegir Ensalada del patio", exact: true }).click()
      const photo = dialog(page).locator(".r-gallery-frame")
      await photo.scrollIntoViewIfNeeded(); const box = await photo.boundingBox()
      await swipe(box.x + box.width * 0.8, box.y + box.height * 0.4, box.x + box.width * 0.25, box.y + box.height * 0.4)
      await page.waitForFunction(() => document.querySelector("dialog .r-gallery-frame img").src.includes("ensalada-2"))
      await audit(page); clean(run)
      results.push({ scenario: "Arrastre táctil del contador y deslizamiento horizontal de fotografías", status: "passed" })
    } finally { await context.close() }
  }
  {
    const run = await contextFor(); const { page, context } = run
    try {
      await page.goto(`${base}/restaurante`); await choose(page)
      await dialog(page).getByRole("button", { name: "Explorar la carta mientras espero", exact: true }).click()
      let pipResult = "API no disponible; control oculto"
      if (await page.evaluate(() => "documentPictureInPicture" in window)) {
        await page.locator(".r-timer").getByRole("button", { name: "Abrir contador en ventana flotante", exact: true }).click()
        await page.waitForFunction(() => document.querySelector(".r-timer-pip-note, .r-timer-error"))
        if (await page.locator(".r-timer-pip-note").count()) {
          assert((await page.evaluate(() => documentPictureInPicture.window.document.body.innerText)).includes("Volver a mi visita"))
          await page.evaluate(() => documentPictureInPicture.window.document.querySelector("button").click())
          await dialog(page).getByRole("heading", { name: "Estamos preparando tu mesa.", exact: true }).waitFor()
          assert.equal(await page.evaluate(() => !!documentPictureInPicture.window), false)
          pipResult = "Ventana creada, contenido y retorno comprobados"
        } else pipResult = "API presente; rechazo del navegador con recuperación visible"
      }
      clean(run); results.push({ scenario: "Ventana flotante opcional", detail: pipResult, status: "passed" })
    } finally { await context.close() }
  }
  {
    const run = await contextFor(); const { page, context } = run
    try {
      await page.goto(`${base}/restaurante`); await choose(page)
      await dialog(page).getByRole("button", { name: "Explorar la carta mientras espero", exact: true }).click()
      await page.locator(".r-timer").getByRole("button", { name: "Saltar espera desde el contador", exact: true }).click()
      await page.getByRole("button", { name: "Entendido", exact: true }).click()
      const table = await page.evaluate(() => JSON.parse(localStorage.getItem("patio12-demo-v1")).visit.table)
      await page.getByRole("link", { name: "Volver al portafolio de demos", exact: true }).click()
      await page.locator('a[href="/psicologo"]').click(); await page.locator(".demo-theme-switcher").waitFor()
      await page.waitForFunction(() => {
        const timer = document.querySelector(".r-timer").getBoundingClientRect(), selector = document.querySelector(".demo-theme-switcher").getBoundingClientRect()
        return timer.bottom <= selector.top || timer.right <= selector.left || timer.left >= selector.right
      })
      await bounds(page); await page.locator(".r-timer-open").click()
      await dialog(page).getByRole("heading", { name: `Mesa ${table}`, exact: true }).waitFor()
      clean(run); results.push({ scenario: "Miniatura sobre Psicólogo, sin cubrir su selector, y retorno a la misma mesa", status: "passed" })
    } finally { await context.close() }
  }
  {
    const run = await contextFor(); const { page, context } = run
    try {
      await page.addInitScript(() => {
        Object.defineProperty(window, "documentPictureInPicture", { configurable: true, value: { requestWindow: async () => { throw new DOMException("Prueba de rechazo", "NotAllowedError") } } })
        Storage.prototype.setItem = () => { throw new DOMException("Almacenamiento bloqueado", "SecurityError") }
        Storage.prototype.removeItem = () => { throw new DOMException("Almacenamiento bloqueado", "SecurityError") }
      })
      await page.goto(`${base}/restaurante`); await choose(page)
      await dialog(page).getByRole("button", { name: "Explorar la carta mientras espero", exact: true }).click()
      await page.locator(".r-storage-note").waitFor()
      await page.locator(".r-timer").getByRole("button", { name: "Abrir contador en ventana flotante", exact: true }).click()
      await page.locator(".r-timer-error").waitFor()
      await page.locator(".r-timer").getByRole("button", { name: "Saltar espera desde el contador", exact: true }).click()
      await page.getByRole("button", { name: "Entendido", exact: true }).click(); await audit(page); clean(run)
      results.push({ scenario: "Almacenamiento bloqueado y rechazo de ventana flotante sin perder el recorrido", status: "passed" })
    } finally { await context.close() }
  }
} finally {
  await browser?.close(); server?.kill()
  await fs.writeFile(path.join(output, "results.json"), JSON.stringify(results, null, 2))
}
console.log(`${results.length} escenarios de Restaurante aprobados. Capturas: ${output}`)
