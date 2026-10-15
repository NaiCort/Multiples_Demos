import assert from "node:assert/strict"
import fs from "node:fs/promises"
import path from "node:path"
import { suite, audit, bounds, nav, button, close, dialog, saved } from "./restaurant-browser.mjs"

const points = ["xalapa", "chapultepec", "alameda", "puebla", "merida", "guadalajara", "monterrey", "tijuana"]
const plainMap = { version: 8, sources: {}, layers: [{ id: "paper", type: "background", paint: { "background-color": "#ecf0e4" } }] }
const mockMap = context => context.route("https://tiles.openfreemap.org/styles/liberty", route => route.fulfill({ json: plainMap }))
async function checkout(page) {
  await button(page.locator(".r-menu-list"), "Elegir Hamburguesa Patio").click(); await button(dialog(page), "Añadir al pedido · $215").click()
  await button(page, "Ver pedido, 1 productos").click(); await button(page, "Continuar con el pedido").click()
}
await suite("restaurante-v423", async ({ run, base, output }) => {
  for (const width of [320, 390, 768, 1440]) await run(`Locales, mapa encima de fichas, ocho rutas y selección · ${width}px`, { viewport: { width, height: 900 } }, async ({ page, mapRequests }) => {
    await page.goto(`${base}/restaurante/locales`); await page.locator(".r-local-card").first().waitFor()
    assert.equal(await page.locator(".r-local-card").count(), 8)
    assert(await page.evaluate(() => !!(document.querySelector(".r-locals-map").compareDocumentPosition(document.querySelector(".r-locals-grid")) & Node.DOCUMENT_POSITION_FOLLOWING)))
    await audit(page); await bounds(page); await page.screenshot({ path: path.join(output, `locales-${width}.png`) })
    await page.getByLabel("Filtrar locales por ciudad", { exact: true }).selectOption("Ciudad de México")
    await page.waitForFunction(() => document.querySelectorAll(".r-local-card").length === 2)
    for (const id of points) {
      await page.goto(`${base}/restaurante/locales/${id}`); await page.locator(".r-local-detail h1").waitFor()
      await bounds(page); assert((await page.locator(".r-service-bar").innerText()).includes("CDMX · Chapultepec"))
      assert((await page.locator("main").innerText()).includes("No existe un restaurante"))
    }
    await audit(page); await page.screenshot({ path: path.join(output, `ficha-${width}.png`) })
    assert.equal(mapRequests.length, 0, "El mapa debe cargarse bajo petición")
    await button(page, "Usar este local en mi visita").click(); await page.waitForFunction(() => JSON.parse(localStorage.getItem("patio12-demo-v1"))?.pointId === "tijuana")
    await button(page, "Pedir en este local").click(); await button(dialog(page), "Para llevar").click(); await page.locator(".r-menu-item").first().waitFor()
    assert.equal((await saved(page)).visit.pointId, "tijuana"); assert.equal(await page.locator(".r-menu-item").count(), 12)
  })
  for (const table of [1, 25]) await run(`QR generado y acceso a mesa ${table}`, { viewport: { width: 390, height: 844 } }, async ({ page }) => {
    await page.goto(`${base}/restaurante/locales/puebla`); await page.locator(".r-qr-section summary").click()
    await page.getByLabel("Tipo de acceso", { exact: true }).selectOption(String(table))
    await button(page, "Generar QR").click(); const qr = page.locator(".r-qr-result img"); await qr.waitFor()
    const imageData = await qr.getAttribute("src")
    await fs.writeFile(path.join(output, `qr-puebla-mesa-${table}.png`), Buffer.from(imageData.split(",")[1], "base64"))
    const url = await page.locator(".r-share-link a").getAttribute("href")
    assert.equal(new URL(url).search, `?punto=puebla&mesa=${table}`)
    await page.locator(".r-share-link a").click(); await button(dialog(page), `Sentarme en la mesa ${table} · demo`).click()
    await page.getByRole("heading", { name: `Mesa ${table}`, exact: true }).waitFor()
    assert.equal((await saved(page)).visit.pointId, "puebla"); assert.equal(new URL(page.url()).pathname, "/restaurante/seguimiento")
    await audit(page)
  })
  await run("Rutas y QR inválidos conservan carrito; URL antigua de seguimiento compatible", {}, async ({ page }) => {
    await page.goto(`${base}/restaurante`); await button(page, "Para llevar").click(); await checkout(page)
    await page.goto(`${base}/restaurante/locales/no-existe`); await page.getByRole("heading", { name: /Ese local no está/ }).waitFor()
    assert.equal((await saved(page)).cart.length, 1)
    await page.goto(`${base}/restaurante/otra-pagina`); await page.getByRole("heading", { name: /Esta página no está/ }).waitFor(); assert.equal((await saved(page)).cart.length, 1)
    await page.goto(`${base}/restaurante?punto=xalapa&mesa=26`); await dialog(page).getByRole("heading", { name: "Este enlace no es válido", exact: true }).waitFor()
    assert.equal(await dialog(page).count(), 1); await audit(page); await button(dialog(page), "Continuar con la demo").click()
    await page.goto(`${base}/restaurante?seguimiento=P12-DEMO`); await page.waitForURL("**/restaurante/seguimiento")
    assert.equal((await saved(page)).cart.length, 1)
  })
  await run("Cambio de local en mesa: aviso, nueva espera y platos conservados", {}, async ({ page }) => {
    await page.goto(`${base}/restaurante?punto=chapultepec&mesa=7`); await button(dialog(page), "Sentarme en la mesa 7 · demo").click(); await button(page, "Elegir mi comida").click()
    await button(page.locator(".r-menu-list"), "Elegir Pasta de la casa").click(); await button(dialog(page), "Añadir al pedido · $195").click()
    await page.goto(`${base}/restaurante/locales/merida`); await button(page, "Usar este local en mi visita").click()
    assert((await dialog(page).innerText()).includes("reinicia la espera")); await button(dialog(page), "Usar este local").click()
    await page.waitForFunction(() => JSON.parse(localStorage.getItem("patio12-demo-v1"))?.pointId === "merida")
    assert.equal((await saved(page)).cart.length, 1); assert.equal((await saved(page)).visit.stage, "waiting"); assert.equal((await saved(page)).visit.table, null)
    await page.goto(`${base}/restaurante/pedido`); assert(await button(page, "Continuar con el pedido").isDisabled())
    await page.goto(`${base}/restaurante/seguimiento`); await button(page, "Saltar espera de demostración").click()
    await page.goto(`${base}/restaurante/pedido`); await button(page, "Continuar con el pedido").click()
    assert.equal(await page.getByLabel("Local del pedido · demo", { exact: true }).inputValue(), "merida"); await audit(page)
  })
  await run("Pedido confirmado fijo; reserva futura en otro local sin alterar recibo", {}, async ({ page }) => {
    await page.goto(`${base}/restaurante`); await button(page, "Para llevar").click(); await checkout(page); await button(page, "Simular pedido · $215").click()
    const order = (await saved(page)).order
    await page.goto(`${base}/restaurante/locales/tijuana`); await button(page, "Reservar aquí").click()
    assert((await dialog(page).innerText()).includes("Tijuana · Morelos")); await close(page)
    await button(page, "Cambiar local").click(); assert((await dialog(page).innerText()).includes("Tu pedido confirmado pertenece a CDMX · Chapultepec")); await button(dialog(page), "Conservar mi pedido").click()
    await button(page, "Pedir en este local").click(); await page.waitForURL("**/restaurante/seguimiento")
    assert.equal((await saved(page)).order.id, order.id); assert.equal((await saved(page)).order.pointId, "chapultepec")
    await audit(page)
  })
  await run("Mapa general real con estilo mínimo, filtro y selección sin cambiar pedido", { viewport: { width: 1440, height: 950 } }, async ({ page, context, mapRequests }) => {
    await mockMap(context); await page.goto(`${base}/restaurante/locales`); await button(page, "Mostrar mapa interactivo").click()
    await page.locator(".r-map-surface.is-ready").waitFor({ timeout: 20_000 }); assert.equal(await page.locator(".r-local-marker").count(), 8)
    assert(await page.locator(".r-local-cluster").count() > 0, "Agrupar referencias superpuestas")
    await audit(page)
    assert(await page.locator(".r-map-canvas canvas").evaluate(el => el.getBoundingClientRect().height >= 300))
    await button(page, "Mostrar Tijuana · Morelos en el mapa").click()
    await page.locator(".r-map-selection").getByText("En el mapa: Tijuana · Morelos", { exact: true }).waitFor()
    assert((await page.locator(".r-service-bar").innerText()).includes("CDMX · Chapultepec"))
    await page.getByLabel("Filtrar locales por ciudad", { exact: true }).selectOption("Ciudad de México")
    await page.waitForFunction(() => document.querySelectorAll(".r-local-marker").length === 2)
    await page.locator(".r-map-surface.is-ready").waitFor(); await bounds(page); await audit(page)
    const requests = mapRequests.length
    await page.waitForTimeout(1_100); assert.equal(mapRequests.length, requests, "El reloj no debe recrear el mapa")
    await page.screenshot({ path: path.join(output, "mapa-general-motor.png") })
    return { map: "MapLibre y worker reales; estilo mínimo determinista" }
  })
  await run("Mapa móvil: grupos pulsables y dos referencias de CDMX separadas", { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }, async ({ page, context }) => {
    await mockMap(context); await page.goto(`${base}/restaurante/locales`); await button(page, "Mostrar mapa interactivo").click()
    await page.locator(".r-map-surface.is-ready").waitFor({ timeout: 20_000 }); await audit(page); await bounds(page)
    await page.locator(".r-local-cluster").first().click()
    await page.getByLabel("Filtrar locales por ciudad", { exact: true }).selectOption("Ciudad de México")
    await page.waitForFunction(() => document.querySelectorAll(".r-local-marker").length === 2)
    await page.locator(".r-map-surface.is-ready").waitFor()
    assert.equal(await page.locator(".r-local-marker:visible").count(), 2); assert.equal(await page.locator(".r-local-cluster").count(), 0)
    await audit(page); await page.screenshot({ path: path.join(output, "mapa-movil.png") })
  })
  await run("Ruta de entrega conserva local y fecha tras navegar y recargar", { viewport: { width: 1440, height: 950 } }, async ({ page, context }) => {
    await mockMap(context); await page.goto(`${base}/restaurante`); await button(page, "A domicilio").click(); await checkout(page)
    await page.getByLabel("Local del pedido · demo", { exact: true }).selectOption("tijuana"); await page.getByLabel("Zona de entrega de ejemplo", { exact: true }).selectOption("centro")
    await button(page, "Simular pedido · $250").click(); const order = (await saved(page)).order
    await button(page, "Mostrar mapa interactivo").click(); await page.locator(".r-map-surface.is-ready").waitFor({ timeout: 20_000 }); await page.locator(".r-map-courier").waitFor({ state: "visible" })
    await button(page, "Avanzar simulación").click(); await page.getByRole("heading", { name: "En camino", exact: true }).waitFor(); await audit(page)
    await page.screenshot({ path: path.join(output, "ruta-motor.png") }); await nav(page, "Locales")
    await page.locator(".r-timer-open").click(); await page.reload(); await page.getByRole("heading", { name: "En camino", exact: true }).waitFor()
    assert.equal((await saved(page)).order.id, order.id); assert.equal((await saved(page)).order.pointId, "tijuana")
    await button(page, "Avanzar simulación").click(); await button(page, "Finalizar entrega de ejemplo").click()
  })
  await run("Permiso de ubicación y proveedor denegados: lista y pedido siguen disponibles", { viewport: { width: 390, height: 844 } }, async ({ page, context }) => {
    await context.route("https://tiles.openfreemap.org/**", route => route.abort("failed"))
    await page.addInitScript(() => { window.geoCalls = 0; Object.defineProperty(navigator, "geolocation", { configurable: true, value: { getCurrentPosition: (_ok, fail) => { window.geoCalls++; fail({ code: 1 }) } } }) })
    await page.goto(`${base}/restaurante/locales`); await page.locator(".r-local-card").first().waitFor(); assert.equal(await page.evaluate(() => window.geoCalls), 0)
    await button(page, "Usar mi ubicación").click(); await page.getByText("Ubicación no autorizada. Puedes elegir un local manualmente.", { exact: true }).waitFor()
    await button(page, "Mostrar mapa interactivo").click(); await button(page, "Reintentar mapa").waitFor({ timeout: 20_000 }); await audit(page)
    await page.locator('.r-local-card[data-local="merida"]').getByRole("button", { name: "Pedir aquí", exact: true }).click(); await button(dialog(page), "Para llevar").click()
    await page.locator(".r-menu-item").first().waitFor(); assert.equal((await saved(page)).visit.pointId, "merida")
  })
  await run("Proveedor cartográfico público y ocho marcadores", { viewport: { width: 1440, height: 950 } }, async ({ page }) => {
    await page.goto(`${base}/restaurante/locales`); await button(page, "Mostrar mapa interactivo").click()
    await page.waitForFunction(() => !!document.querySelector(".r-map-surface.is-ready") || !![...document.querySelectorAll("button")].find(el => el.textContent === "Reintentar mapa"), null, { timeout: 20_000 })
    const live = await page.locator(".r-map-surface.is-ready").count() > 0
    if (live) { assert.equal(await page.locator(".r-local-marker").count(), 8); assert(await page.locator(".r-map-canvas canvas").evaluate(el => el.getBoundingClientRect().height >= 300)) }
    if (process.env.DEMO_REQUIRE_LIVE_MAP === "1") assert(live, "No cargó el proveedor externo")
    await page.screenshot({ path: path.join(output, "mapa-publico.png") }); await audit(page)
    return { cartography: live ? "Proveedor público cargó" : "Proveedor no disponible; lista manual disponible" }
  })
})
