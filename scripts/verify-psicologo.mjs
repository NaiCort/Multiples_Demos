import assert from "node:assert/strict"
import fs from "node:fs/promises"
import path from "node:path"
import { createRequire } from "node:module"
import { chromium } from "playwright"

const require = createRequire(import.meta.url)
const baseUrl = process.env.DEMO_BASE_URL || "http://127.0.0.1:5173"
const output = path.resolve(process.env.DEMO_TEST_OUTPUT || "test-results/psicologo")
const fixturesPath = process.env.DEMO_TEST_FIXTURES
const themes = ["calido", "minimalista", "clinico", "naturaleza"]
const labels = ["Cálido", "Minimalista", "Clínico", "Naturaleza"]
const widths = [320, 390, 768, 1440]
const results = []
const launchOptions = {
  headless: true,
  // Respetar el espacio reservado por la barra nativa en las capturas.
  ignoreDefaultArgs: ["--hide-scrollbars"],
  ...(process.env.DEMO_BROWSER_EXECUTABLE ? { executablePath: process.env.DEMO_BROWSER_EXECUTABLE } : {}),
  ...(process.env.DEMO_BROWSER_CHANNEL ? { channel: process.env.DEMO_BROWSER_CHANNEL } : {}),
  ...(process.getuid?.() === 0 ? { args: ["--no-sandbox"] } : {}),
}

async function prepareContext(browser, theme, width, reducedMotion = "reduce") {
  const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion, ...(width < 640 ? { isMobile: true, hasTouch: true } : {}) })
  await context.addInitScript(value => {
    if (!localStorage.getItem("demo-psicologo-theme")) localStorage.setItem("demo-psicologo-theme", value)
  }, theme)
  // Copias exactas opcionales para entornos sin acceso a los proveedores.
  // La aplicación conserva las URLs públicas originales.
  if (fixturesPath) {
    const fixtures = JSON.parse(await fs.readFile(path.join(fixturesPath, "index.json"), "utf8"))
    await context.route("https://**/*", async route => {
      const fixture = fixtures[route.request().url()]
      if (fixture) return route.fulfill({ contentType: fixture.type, body: await fs.readFile(path.join(fixturesPath, fixture.file)) })
      return route.continue()
    })
  }
  return context
}

async function auditAccessibility(page) {
  await page.addScriptTag({ path: require.resolve("axe-core/axe.min.js") })
  const violations = await page.evaluate(async () => {
    const result = await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] } })
    return result.violations.map(item => ({ id: item.id, impact: item.impact, nodes: item.nodes.map(node => ({ target: node.target, summary: node.failureSummary })) }))
  })
  assert.deepEqual(violations, [])
}
const waitForFocus = (page, selector) => page.waitForFunction(value => document.activeElement?.matches(value), selector)
const closeDialog = async page => { await page.keyboard.press("Escape"); await page.locator("dialog").waitFor({ state: "detached" }) }

async function verifyFlows(page, theme, width) {
  const checks = []
  if (width < 1280) {
    const opener = page.getByRole("button", { name: "Abrir menú", exact: true })
    await opener.click()
    await page.getByRole("dialog", { name: "Menú de la demo" }).waitFor()
    for (const key of ["Tab", "Shift+Tab"]) {
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press(key)
        assert(await page.evaluate(() => !!document.activeElement?.closest("dialog")), `El foco salió del menú con ${key}`)
      }
    }
    await closeDialog(page)
    await waitForFocus(page, 'button[aria-label="Abrir menú"]')
    await opener.click()
    await page.getByRole("dialog").getByRole("link", { name: "Servicios", exact: true }).click()
    await page.locator("dialog").waitFor({ state: "detached" })
    await waitForFocus(page, "#servicios h2")
    checks.push("Menú: Tab, Shift+Tab, Escape, devolución de foco y navegación")
    if (theme !== "minimalista") {
      await opener.click()
      await page.getByRole("dialog").getByRole("button", { name: "Agendar cita", exact: true }).click()
      await page.getByRole("dialog").getByText("1 de 3 · Elige un servicio", { exact: true }).waitFor()
      await closeDialog(page)
      await waitForFocus(page, 'button[aria-label="Abrir menú"]')
      checks.push("Agendar desde menú y devolución de foco")
    }
  } else {
    await page.getByRole("navigation").getByRole("link", { name: "Servicios", exact: true }).click()
    await waitForFocus(page, "#servicios h2")
    await page.waitForFunction(() => document.querySelector('nav a[href="#servicios"]')?.getAttribute("aria-current") === "location")
    checks.push("Navegación de escritorio e indicador activo")
  }
  const service = page.locator("#servicios button").nth(2)
  await service.click()
  const reservation = page.getByRole("dialog")
  await reservation.getByRole("button", { name: "Online", exact: true }).waitFor()
  assert.equal(await reservation.getByRole("button", { name: "Presencial", exact: true }).count(), 0)
  assert.equal(await reservation.getByRole("button", { name: "Confirmar reserva", exact: true }).isEnabled(), false)
  await reservation.getByRole("button", { name: "Online", exact: true }).click()
  await reservation.getByRole("button", { name: "Viernes 12:00 pm", exact: true }).click()
  await reservation.getByRole("button", { name: "Confirmar reserva", exact: true }).click()
  await reservation.getByText(/No se generó una reserva real/).waitFor()
  assert(await page.evaluate(() => !!document.activeElement?.closest("dialog")))
  await auditAccessibility(page)
  await reservation.getByRole("button", { name: "Reiniciar demo", exact: true }).click()
  await reservation.getByRole("button", { name: /Terapia de Pareja/ }).click()
  await reservation.getByRole("button", { name: "Continuar", exact: true }).click()
  await reservation.getByRole("button", { name: "Presencial", exact: true }).click()
  await reservation.getByRole("button", { name: "Lunes 10:00 am", exact: true }).click()
  await reservation.getByRole("button", { name: "Cambiar servicio", exact: true }).click()
  await reservation.getByRole("button", { name: /Orientación Psicológica/ }).click()
  await reservation.getByRole("button", { name: "Continuar", exact: true }).click()
  assert.equal(await reservation.getByRole("button", { name: "Online", exact: true }).getAttribute("aria-pressed"), "false")
  assert.equal(await reservation.getByRole("button", { name: "Confirmar reserva", exact: true }).isEnabled(), false)
  await closeDialog(page)
  assert(await service.evaluate(element => element === document.activeElement))
  checks.push("Reserva: restricciones, confirmación, reinicio y cambio de servicio")
  if (width >= 1280 && theme !== "minimalista") {
    await page.getByRole("navigation").getByRole("button", { name: "Agendar cita", exact: true }).click()
    await page.getByRole("dialog").getByText("1 de 3 · Elige un servicio", { exact: true }).waitFor()
    await closeDialog(page)
    checks.push("Agendar abre la reserva")
  }
  await page.locator("#contacto button").filter({ hasText: "WhatsApp" }).click()
  const chat = page.getByRole("dialog", { name: "WhatsApp de demostración", exact: true })
  await chat.getByRole("button", { name: "Hola, me gustaría agendar una primera cita", exact: true }).click()
  await chat.getByText("Simulación completada. No se ha enviado ningún mensaje.", { exact: true }).waitFor()
  await auditAccessibility(page)
  await chat.getByRole("button", { name: "Elegir otro mensaje", exact: true }).click()
  await chat.getByRole("button", { name: "Hola, me gustaría agendar una primera cita", exact: true }).waitFor()
  await closeDialog(page)
  checks.push("WhatsApp: selección, respuesta, reinicio y cierre")
  await page.getByRole("button", { name: "Simular envío", exact: true }).click()
  await waitForFocus(page, 'input[name="nombre"]')
  assert.equal(await page.locator("#contacto [aria-invalid=true]").count(), 4)
  await auditAccessibility(page)
  await page.getByRole("button", { name: "Rellenar con datos de ejemplo", exact: true }).click()
  await page.getByRole("button", { name: "Simular envío", exact: true }).click()
  await page.locator("#contacto").getByText(/El formulario no ha enviado datos/).waitFor()
  await auditAccessibility(page)
  await page.getByRole("button", { name: "Reiniciar demo", exact: true }).click()
  await waitForFocus(page, 'input[name="nombre"]')
  assert.equal(await page.getByRole("textbox", { name: "Nombre de ejemplo", exact: true }).inputValue(), "")
  checks.push("Formulario: errores, ejemplo, confirmación, reinicio y foco")
  await page.getByRole("button", { name: "Aviso de privacidad", exact: true }).click()
  await page.getByRole("dialog", { name: "Privacidad de esta demostración", exact: true }).waitFor()
  await auditAccessibility(page)
  await page.getByRole("button", { name: "Entendido", exact: true }).click()
  await page.locator("dialog").waitFor({ state: "detached" })
  await page.getByRole("button", { name: width < 640 ? "Contactar" : "Solicitar un sitio similar", exact: true }).click()
  const contact = page.getByRole("dialog", { name: "Hablemos de tu proyecto", exact: true })
  assert.match(await contact.getByRole("link", { name: /WhatsApp/ }).getAttribute("href"), /^https:\/\/wa\.me\/522281628345\?/)
  assert.match(await contact.getByRole("link", { name: /Correo/ }).getAttribute("href"), /^mailto:/)
  await auditAccessibility(page)
  await closeDialog(page)
  checks.push("Privacidad y canales comerciales reales, sin enviar mensajes")
  if (theme === "minimalista") {
    await page.getByRole("button", { name: "Siguiente reseña", exact: true }).click()
    assert.equal(await page.locator("#resenas").getByText("2 / 3", { exact: true }).count(), 1)
    await page.getByRole("button", { name: "Reseña anterior", exact: true }).click()
    checks.push("Carrusel de reseñas")
  }
  return checks
}

async function verifyThemePreferences(browser) {
  const headings = [/Un espacio seguro/, /Terapia psicológica/, /Atención psicológica/, /Encontrar calma/]
  for (const width of [390, 1440]) {
    const context = await prepareContext(browser, "calido", width, "no-preference")
    const page = await context.newPage()
    page.setDefaultTimeout(15000)
    const errors = []
    page.on("pageerror", error => errors.push(error.message))
    try {
      await page.goto(`${baseUrl}/psicologo`, { waitUntil: "domcontentloaded" })
      for (const [index, theme] of themes.entries()) {
        const button = page.getByRole("button", { name: `Tema ${labels[index]}`, exact: true })
        if (width < 640) await button.tap()
        else { await button.focus(); await page.keyboard.press("Enter") }
        await page.getByRole("heading", { level: 1 }).filter({ hasText: headings[index] }).waitFor()
        await page.waitForFunction(() => ![...document.querySelectorAll('[aria-hidden="true"]')].some(element => getComputedStyle(element).zIndex === "70"))
        assert.equal(await button.getAttribute("aria-pressed"), "true")
        assert.equal(await page.evaluate(() => localStorage.getItem("demo-psicologo-theme")), theme)
      }
      await page.reload({ waitUntil: "domcontentloaded" })
      await page.getByRole("heading", { level: 1 }).filter({ hasText: headings[3] }).waitFor()
      assert.equal(await page.getByRole("button", { name: "Tema Naturaleza", exact: true }).getAttribute("aria-pressed"), "true")
      await page.getByRole("button", { name: "Cómo funciona esta demo", exact: true }).click()
      await page.getByRole("dialog", { name: "Cómo funciona esta demo", exact: true }).waitFor()
      await auditAccessibility(page)
      await closeDialog(page)
      await page.getByRole("link", { name: "Volver al portafolio de demos", exact: true }).click()
      await page.getByRole("link", { name: /Psicólogo/ }).click()
      await page.getByRole("heading", { level: 1 }).filter({ hasText: headings[3] }).waitFor()
      assert.deepEqual(errors, [])
      results.push({ status: "passed", width, scenario: width < 640 ? "Selector táctil" : "Selector con teclado", checks: ["Cuatro temas", "Oscurecimiento retirado al elegir", "Persistencia al recargar y volver del portafolio", "Ayuda", "Animaciones activadas"] })
      console.log(`OK Selector ${width < 640 ? "táctil" : "con teclado"}, persistencia, ayuda y retorno`)
    } catch (error) {
      results.push({ status: "failed", width, scenario: "Selector", error: error.message })
      await page.screenshot({ path: path.join(output, `selector-${width}-fallo.png`) }).catch(() => {})
      throw error
    } finally {
      await fs.writeFile(path.join(output, "results.json"), JSON.stringify(results, null, 2))
      await context.close()
    }
  }
}

await fs.mkdir(output, { recursive: true })
let browser
try {
  browser = await chromium.launch(launchOptions)
  for (const [index, theme] of themes.entries()) {
    for (const width of widths) {
      const context = await prepareContext(browser, theme, width)
      const page = await context.newPage()
      page.setDefaultTimeout(15000)
      const errors = []
      const submissions = []
      page.on("pageerror", error => errors.push(error.message))
      page.on("request", request => { if (["POST", "PUT", "PATCH", "DELETE"].includes(request.method())) submissions.push(request.url()) })
      try {
        await page.goto(`${baseUrl}/psicologo`, { waitUntil: "domcontentloaded", timeout: 15000 })
        await page.getByRole("button", { name: `Tema ${labels[index]}`, exact: true }).waitFor()
        assert.equal(await page.getByRole("button", { name: "Abrir menú", exact: true }).isVisible(), width < 1280)
        await page.evaluate(() => Promise.race([document.fonts.ready, new Promise(resolve => setTimeout(resolve, 3000))]))
        const dimensions = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }))
        assert(dimensions.content <= dimensions.viewport + 1, `Desborde horizontal: ${JSON.stringify(dimensions)}`)
        await page.screenshot({ path: path.join(output, `${theme}-${width}-inicio.png`) })
        await page.locator(".demo-room-image").scrollIntoViewIfNeeded()
        await page.waitForFunction(() => { const image = document.querySelector(".demo-room-image"); return image?.complete && image.naturalWidth > 0 })
        const room = await page.locator(".demo-room-image").evaluate(element => {
          const rectangle = element.getBoundingClientRect()
          return { width: rectangle.width, height: rectangle.height, fit: getComputedStyle(element).objectFit }
        })
        assert(Math.abs(room.width / room.height - 4 / 3) < 0.01)
        assert.equal(room.fit, "contain")
        await page.screenshot({ path: path.join(output, `${theme}-${width}-sala.png`) })
        await auditAccessibility(page)
        const flows = [390, 1440].includes(width) ? await verifyFlows(page, theme, width) : []
        assert.deepEqual(errors, [])
        assert.deepEqual(submissions, [], "Una simulación intentó enviar datos")
        results.push({ theme, width, status: "passed", room, flows, errors, submissions })
        console.log(`OK ${labels[index]} · ${width}px · ${flows.length} recorridos`)
      } catch (error) {
        await page.screenshot({ path: path.join(output, `${theme}-${width}-fallo.png`) }).catch(() => {})
        results.push({ theme, width, status: "failed", error: error.message })
        throw error
      } finally {
        await fs.writeFile(path.join(output, "results.json"), JSON.stringify(results, null, 2))
        await context.close()
      }
    }
  }
  await verifyThemePreferences(browser)
  console.log("16 combinaciones y 2 recorridos del selector aprobados. axe no sustituye una revisión humana ni certifica conformidad completa.")
} finally {
  await browser?.close()
}
