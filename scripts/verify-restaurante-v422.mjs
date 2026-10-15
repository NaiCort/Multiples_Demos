import assert from "node:assert/strict"
import fs from "node:fs/promises"
import path from "node:path"
import { spawn } from "node:child_process"
import { createRequire } from "node:module"
import { chromium } from "playwright"

const require = createRequire(import.meta.url)
const managed = process.env.DEMO_START_PREVIEW === "1"
const base = process.env.DEMO_BASE_URL || (managed ? "http://127.0.0.1:4173" : "http://127.0.0.1:5173")
const output = path.resolve(process.env.DEMO_TEST_OUTPUT || "test-results/restaurante-v422")
const points = [["xalapa", "Parque Juárez"], ["chapultepec", "Bosque de Chapultepec"], ["alameda", "Alameda Central"], ["puebla", "Zócalo de Puebla"], ["merida", "Plaza Grande"], ["guadalajara", "Parque Agua Azul"], ["monterrey", "Parque Fundidora"], ["tijuana", "Parque Morelos"]]
const results = []
let server, browser
const dialog = page => page.getByRole("dialog")
const button = (page, name) => dialog(page).getByRole("button", { name, exact: true })
const close = async page => { await page.keyboard.press("Escape"); await dialog(page).waitFor({ state: "detached" }) }
async function bounds(page) { assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "Desborde horizontal"); if (await dialog(page).count()) assert(await dialog(page).evaluate(el => el.scrollWidth <= el.clientWidth + 1), "Desborde dentro del diálogo") }
async function audit(page) {
  await page.addScriptTag({ path: require.resolve("axe-core/axe.min.js") })
  const violations = await page.evaluate(async () => (await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"] } })).violations.map(item => ({ id: item.id, targets: item.nodes.map(node => node.target) })))
  assert.deepEqual(violations, [])
}
async function run(name, options, verify) {
  const context = await browser.newContext({ reducedMotion: "reduce", ...options })
  const page = await context.newPage(), errors = [], submissions = [], mapRequests = []
  page.on("pageerror", error => errors.push(error.message))
  page.on("request", request => { if (["POST", "PUT", "PATCH", "DELETE"].includes(request.method())) submissions.push(request.url()); if (request.url().includes("tiles.openfreemap.org")) mapRequests.push(request.url()) })
  try { const detail = await verify({ page, context, mapRequests }); assert.deepEqual(errors, []); assert.deepEqual(submissions, []); results.push({ name, status: "passed", ...detail }); console.log(`Aprobado: ${name}`) }
  finally { await context.close() }
}
async function pickup(page) { await page.goto(`${base}/restaurante`); await button(page, "Para llevar").click() }
async function addBurger(page) { await page.locator(".r-menu-list").getByRole("button", { name: "Elegir Hamburguesa Patio", exact: true }).click(); await button(page, "Añadir al pedido · $215").click(); await page.getByRole("button", { name: "Ver pedido, 1 productos", exact: true }).click(); await button(page, "Continuar con el pedido").click() }

await fs.mkdir(output, { recursive: true })
try {
  if (managed) {
    server = spawn(process.execPath, [path.join(path.dirname(require.resolve("vite/package.json")), "bin/vite.js"), "preview", "--host", "127.0.0.1", "--port", "4173", "--strictPort"], { stdio: "ignore" })
    let ready = false
    for (let i = 0; i < 100; i++) { try { if ((await fetch(base)).ok) { ready = true; break } } catch { /* Servidor iniciando. */ } await new Promise(resolve => setTimeout(resolve, 100)) }
    assert(ready, "No inició la vista previa")
  }
  browser = await chromium.launch({ headless: true, ignoreDefaultArgs: ["--hide-scrollbars"], ...(process.env.DEMO_BROWSER_EXECUTABLE ? { executablePath: process.env.DEMO_BROWSER_EXECUTABLE } : {}), ...(process.env.DEMO_BROWSER_CHANNEL ? { channel: process.env.DEMO_BROWSER_CHANNEL } : {}), ...(process.getuid?.() === 0 ? { args: ["--no-sandbox"] } : {}) })
  for (const width of [320, 390, 768, 1440]) await run(`Identidad, ocho puntos, teclado y QR · ${width}px`, { viewport: { width, height: 900 } }, async ({ page, mapRequests }) => {
    await pickup(page)
    await page.locator("#inicio").evaluate(el => el.scrollIntoView({ block: "start", behavior: "instant" }))
    await page.screenshot({ path: path.join(output, `inicio-${width}.png`), fullPage: false })
    await page.locator("#carta").evaluate(el => el.scrollIntoView({ block: "start", behavior: "instant" }))
    await bounds(page); await page.screenshot({ path: path.join(output, `carta-${width}.png`) })
    await page.getByRole("button", { name: "Explorar puntos y mapa", exact: true }).click()
    assert.equal(await page.locator(".r-point-list > button").count(), 8)
    for (const [id, name] of points) { if (width < 700) await page.getByLabel("Punto para explorar", { exact: true }).selectOption(id); else await page.locator(".r-point-list > button").filter({ hasText: name }).click(); await page.locator(".r-point-detail").getByRole("heading", { name, exact: true }).waitFor(); await bounds(page) }
    assert.equal(mapRequests.length, 0, "No cargar cartografía antes de pulsar Mostrar mapa")
    for (let i = 0; i < 12; i++) { await page.keyboard.press(i % 2 ? "Shift+Tab" : "Tab"); assert(await page.evaluate(() => !!document.activeElement.closest("dialog"))) }
    await audit(page); await dialog(page).evaluate(el => el.scrollTop = 0); await page.screenshot({ path: path.join(output, `puntos-${width}.png`) })
    await page.locator(".r-qr-section > summary").click(); await page.getByLabel("Tipo de acceso", { exact: true }).selectOption("25"); await button(page, "Generar QR").click()
    const qr = page.locator(".r-qr-result img"); await qr.waitFor()
    const png = await qr.getAttribute("src"); assert(png.startsWith("data:image/png;base64,"))
    if (width === 1440) { await fs.writeFile(path.join(output, "qr-mesa25.png"), Buffer.from(png.split(",")[1], "base64")); await fs.writeFile(path.join(output, "qr-url.txt"), `${base}/restaurante?punto=tijuana&mesa=25`) }
    assert((await page.locator(".r-share-link").innerText()).includes("punto=tijuana&mesa=25")); await audit(page); await close(page)
    return { mapLoadedOnDemand: true }
  })
  for (const table of [1, 25]) await run(`QR válido · mesa ${table}`, {}, async ({ page }) => {
    await page.goto(`${base}/restaurante?punto=puebla&mesa=${table}`); await button(page, `Sentarme en la mesa ${table} · demo`).click(); await dialog(page).getByRole("heading", { name: `Mesa ${table}`, exact: true }).waitFor(); await audit(page)
    await button(page, "Elegir mi comida").click(); await page.reload(); assert((await page.locator(".r-service-bar").innerText()).includes(`Mesa ${table}`))
  })
  await run("Enlace inválido y recuperación", {}, async ({ page }) => {
    await page.goto(`${base}/restaurante?punto=xalapa&mesa=26`); await dialog(page).getByRole("heading", { name: "Este enlace no es válido", exact: true }).waitFor(); assert.equal(await dialog(page).count(), 1); await audit(page); await button(page, "Continuar con la demo").click(); await button(page, "Para llevar").click()
  })
  await run("Bebida y combo con suplementos, edición y recibo", { viewport: { width: 390, height: 844 } }, async ({ page }) => {
    await pickup(page)
    await page.locator(".r-menu-list").getByRole("button", { name: "Elegir Hamburguesa Patio", exact: true }).click()
    await dialog(page).getByLabel("Proteína", { exact: true }).selectOption("doble")
    await dialog(page).getByRole("checkbox", { name: /Añadir entrada pequeña/ }).check()
    await dialog(page).getByRole("radio", { name: /Ensalada pequeña/ }).check(); await dialog(page).getByRole("radio", { name: /Limonada · 250 ml/ }).check()
    await audit(page); await page.screenshot({ path: path.join(output, "combo.png") }); await button(page, "Añadir al pedido · $355").click()
    await page.locator(".r-menu-list").getByRole("button", { name: "Elegir Café americano", exact: true }).click(); await dialog(page).getByRole("radio", { name: /Grande · 360 ml/ }).check(); await dialog(page).getByRole("radio", { name: /Con hielo/ }).check(); await dialog(page).getByLabel("Cantidad de Azúcar aparte", { exact: true }).selectOption("none"); await button(page, "Añadir al pedido · $57").click()
    await page.getByRole("button", { name: "Ver pedido, 2 productos", exact: true }).click(); assert((await dialog(page).innerText()).includes("Combo: Ensalada pequeña + Limonada")); await button(page, "Editar Café americano").click(); assert(await dialog(page).getByRole("radio", { name: /Con hielo/ }).isChecked()); await button(page, "Guardar cambios · $57").click()
    await page.getByRole("button", { name: "Ver pedido, 2 productos", exact: true }).click(); await button(page, "Continuar con el pedido").click(); await button(page, "Simular pedido · $412").click(); await dialog(page).getByRole("heading", { name: "En preparación", exact: true }).waitFor(); await page.getByText("Ver recibo y configuración", { exact: true }).click(); assert((await page.locator(".r-receipt-content").innerText()).includes("Doble res")); await audit(page)
  })
  await run("Cobertura, punto fijo, mapa de ruta y recarga", { viewport: { width: 1440, height: 950 } }, async ({ page, context }) => {
    await page.goto(`${base}/restaurante`); await button(page, "A domicilio").click(); await addBurger(page)
    await page.getByLabel("Punto del pedido · demostración", { exact: true }).selectOption("tijuana")
    await page.getByLabel("Zona de entrega de ejemplo", { exact: true }).selectOption("fuera"); assert(await dialog(page).locator(".r-button.r-full").last().isDisabled()); await audit(page)
    await page.getByLabel("Zona de entrega de ejemplo", { exact: true }).selectOption("centro"); await button(page, "Simular pedido · $250").click(); await dialog(page).getByRole("heading", { name: "En preparación", exact: true }).waitFor()
    const order = await page.evaluate(() => JSON.parse(localStorage.getItem("patio12-demo-v1")).order)
    await close(page); await page.getByRole("button", { name: "Explorar puntos y mapa", exact: true }).click(); await page.locator(".r-point-list > button").filter({ hasText: "Parque Juárez" }).click(); assert((await dialog(page).innerText()).includes("conserva Parque Morelos")); assert.equal(await page.getByRole("button", { name: "Usar este punto en mi visita", exact: true }).count(), 0); await close(page)
    await page.getByRole("button", { name: "Mi seguimiento", exact: true }).click()
    // Un estilo mínimo determinista verifica motor, worker, capas y marcador sin depender del proveedor.
    await context.route("https://tiles.openfreemap.org/styles/liberty", route => route.fulfill({ json: { version: 8, sources: {}, layers: [{ id: "paper", type: "background", paint: { "background-color": "#ecf0e4" } }] } }))
    await button(page, "Mostrar mapa interactivo").click(); await page.locator(".r-map-surface.is-ready").waitFor({ timeout: 20_000 }); assert(await page.locator(".r-map-canvas canvas").evaluate(el => el.getBoundingClientRect().height >= 250), "Lienzo del mapa sin altura"); await page.locator(".r-map-courier").waitFor({ state: "visible" }); await audit(page)
    await button(page, "Avanzar simulación").click(); await dialog(page).getByRole("heading", { name: "En camino", exact: true }).waitFor(); await page.screenshot({ path: path.join(output, "seguimiento-motor.png") })
    await page.reload(); await dialog(page).getByRole("heading", { name: "En camino", exact: true }).waitFor(); const restored = await page.evaluate(() => JSON.parse(localStorage.getItem("patio12-demo-v1")).order); assert.equal(restored.id, order.id); assert.equal(restored.pointId, "tijuana")
    await button(page, "Avanzar simulación").click(); await button(page, "Finalizar entrega de ejemplo").click(); await dialog(page).getByRole("heading", { name: "Visita finalizada", exact: true }).waitFor()
    return { mapStyle: "fixture mínima; motor MapLibre y worker reales" }
  })
  await run("Mapa y geolocalización denegados, recuperación manual", { viewport: { width: 390, height: 844 } }, async ({ page, context }) => {
    await context.route("https://tiles.openfreemap.org/**", route => route.abort("failed"))
    await page.addInitScript(() => { Object.defineProperty(navigator, "geolocation", { configurable: true, value: { getCurrentPosition: (_ok, fail) => fail({ code: 1 }) } }) })
    await pickup(page); await page.getByRole("button", { name: "Explorar puntos y mapa", exact: true }).click(); await button(page, "Usar mi ubicación").click(); await page.getByText("Ubicación no autorizada. Puedes elegir cualquiera de los puntos manualmente.", { exact: true }).waitFor(); await button(page, "Mostrar mapa interactivo").click(); await button(page, "Reintentar mapa").waitFor({ timeout: 20_000 }); await audit(page)
    await page.getByLabel("Punto para explorar", { exact: true }).selectOption("merida"); await button(page, "Usar este punto en mi visita").click(); assert((await page.locator(".r-service-bar").innerText()).includes("Plaza Grande"))
  })
  await run("Proveedor cartográfico público", { viewport: { width: 1440, height: 950 } }, async ({ page }) => {
    await pickup(page); await page.getByRole("button", { name: "Explorar puntos y mapa", exact: true }).click(); await button(page, "Mostrar mapa interactivo").click(); await page.waitForFunction(() => !!document.querySelector(".r-map-surface.is-ready") || !![...document.querySelectorAll("button")].find(el => el.textContent === "Reintentar mapa"), { timeout: 20_000 })
    const live = await page.locator(".r-map-surface.is-ready").count() > 0
    if (live) { assert(await page.locator(".r-map-canvas canvas").evaluate(el => el.getBoundingClientRect().height >= 250), "Lienzo del mapa sin altura"); await page.locator(".r-map-marker").waitFor({ state: "visible" }) }
    if (process.env.DEMO_REQUIRE_LIVE_MAP === "1") assert(live, "El proveedor externo no cargó; revisar conectividad")
    await page.screenshot({ path: path.join(output, "mapa-publico.png") }); await audit(page)
    return { externalCartography: live ? "cargó" : "no disponible; recuperación manual comprobada" }
  })
} finally { await browser?.close(); server?.kill(); await fs.writeFile(path.join(output, "results.json"), JSON.stringify(results, null, 2)) }
console.log(`${results.length} escenarios de V4.2.2 aprobados. Resultados: ${output}`)
