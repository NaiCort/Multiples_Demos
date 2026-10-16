import assert from "node:assert/strict"
import fs from "node:fs/promises"
import path from "node:path"
import { createHash } from "node:crypto"
import { suite, audit, bounds, nav, button, dialog, saved } from "./restaurant-browser.mjs"

const geo = async (page, width, country, state = "") => {
  if (width >= 1000) {
    await button(page.locator(".r-locations-sidebar"), country === "us" ? "Estados Unidos" : "México").click()
    if (state) await button(page.locator(".r-locations-sidebar"), `${state === "texas" ? "Texas" : "California"}, Estados Unidos`).click()
  } else {
    await page.getByLabel("País de los locales", { exact: true }).selectOption(country)
    if (state) await page.getByLabel("Estado de los locales", { exact: true }).selectOption(state)
  }
}
const category = async (page, width, label) => {
  if (width >= 1000) await button(page.locator(".r-carta-sidebar"), label).click()
  else await page.getByLabel("Categoría de la carta", { exact: true }).selectOption(label)
}
const newPoints = ["oaxaca", "chiapas", "queretaro", "guanajuato", "austin", "san-antonio", "los-angeles", "san-francisco"]
const minimalMap = { version: 8, sources: {}, layers: [{ id: "paper", type: "background", paint: { "background-color": "#ecf0e4" } }] }

await suite("restaurante-v425", async ({ run, base, output }) => {
  for (const width of [320, 390, 768, 1024, 1440]) await run(`Carta y directorio con navegación lateral adaptable · ${width}px`, { viewport: { width, height: 950 }, ...(width < 640 ? { isMobile: true, hasTouch: true } : {}), reducedMotion: width === 1440 ? "no-preference" : "reduce" }, async ({ page, mapRequests }) => {
    await page.goto(`${base}/restaurante/carta`); await page.locator(".r-menu-item").first().waitFor()
    await page.waitForFunction(() => document.querySelectorAll(".r-menu-item").length === 28); assert.equal(await page.locator(".r-menu-item").count(), 28)
    if (width >= 1000) {
      const side = await page.locator(".r-carta-sidebar").boundingBox(), main = await page.locator(".r-carta-content").boundingBox()
      assert(side.x + side.width < main.x, "La lista de categorías queda a la izquierda")
      assert(await page.locator(".r-sidebar-desktop").isVisible())
    } else assert(await page.getByLabel("Categoría de la carta", { exact: true }).isVisible())
    await category(page, width, "Desayunos"); await page.waitForFunction(() => document.querySelectorAll(".r-menu-item").length === 3); assert.equal(await page.locator(".r-menu-item").count(), 3)
    for (const img of await page.locator(".r-menu-item img").all()) { await img.scrollIntoViewIfNeeded(); await img.evaluate(el => el.decode()) }
    await audit(page); await bounds(page)
    await page.screenshot({ path: path.join(output, `carta-desayunos-${width}.png`), fullPage: true })
    await category(page, width, "Ensaladas"); await page.waitForFunction(() => document.querySelectorAll(".r-menu-item").length === 2); assert.equal(await page.locator(".r-menu-item").count(), 2)
    await page.getByLabel("Preferencia", { exact: true }).selectOption("vegan"); await page.waitForFunction(() => document.querySelectorAll(".r-menu-item").length === 1); assert.equal(await page.locator(".r-menu-item").count(), 1)
    const search = page.getByRole("searchbox", { name: "Buscar en la carta", exact: true })
    await search.fill("no existe"); await page.getByRole("heading", { name: "No encontramos ese antojo.", exact: true }).waitFor()
    await button(page, "Ver toda la carta").click(); await page.waitForFunction(() => document.querySelectorAll(".r-menu-item").length === 28); assert.equal(await page.locator(".r-menu-item").count(), 28)
    assert(await search.evaluate(el => el === document.activeElement))
    await nav(page, "Locales"); await page.waitForFunction(() => document.querySelectorAll(".r-local-card").length === 16); assert.equal(await page.locator(".r-local-card").count(), 16)
    await geo(page, width, "us"); await page.waitForFunction(() => document.querySelectorAll(".r-local-card").length === 4); assert.equal(await page.locator(".r-local-card").count(), 4)
    await geo(page, width, "us", "texas"); await page.waitForFunction(() => document.querySelectorAll(".r-local-card").length === 2); assert.equal(await page.locator(".r-local-card").count(), 2)
    assert(await page.locator('[data-local="austin"]').count()); assert(await page.locator('[data-local="san-antonio"]').count())
    await page.getByLabel("Filtrar locales por ciudad", { exact: true }).selectOption("Austin, Texas"); await page.waitForFunction(() => document.querySelectorAll(".r-local-card").length === 1); assert.equal(await page.locator(".r-local-card").count(), 1)
    await geo(page, width, "us", "california"); await page.waitForFunction(() => document.querySelectorAll(".r-local-card").length === 2); assert.equal(await page.locator(".r-local-card").count(), 2)
    assert.equal(await page.getByLabel("Filtrar locales por ciudad", { exact: true }).inputValue(), "")
    assert((await page.locator(".r-service-bar").innerText()).includes("CDMX · Chapultepec"))
    assert(await page.evaluate(() => !!(document.querySelector(".r-locals-map").compareDocumentPosition(document.querySelector(".r-locals-directory")) & Node.DOCUMENT_POSITION_FOLLOWING)))
    await page.reload(); await page.locator('[data-local="san-francisco"]').waitFor(); await page.waitForFunction(() => document.querySelectorAll(".r-local-card").length === 2); assert.equal(await page.locator(".r-local-card").count(), 2)
    await audit(page); await bounds(page); await page.screenshot({ path: path.join(output, `locales-california-${width}.png`), fullPage: true })
    assert.equal(mapRequests.length, 0)
  })
  await run("Cambiar local conserva carrito, resuelve especialidad regional y fija recibo", { viewport: { width: 1440, height: 950 } }, async ({ page }) => {
    await page.goto(`${base}/restaurante`); await button(page, "Para llevar").click()
    await category(page, 1440, "Sabores de la región"); await button(page, "Elegir Tacos al pastor").click(); await button(dialog(page), "Añadir al pedido · $175").click()
    const visit = (await saved(page)).visit.id
    await button(page, "Cambiar local de la carta").click(); await dialog(page).getByLabel("Local simulado", { exact: true }).selectOption("austin"); await button(dialog(page), "Usar este local").click()
    await page.locator('[data-product="brisket"]').waitFor(); assert.equal(await page.locator('[data-product="pastor"]').count(), 0)
    assert.equal((await saved(page)).visit.id, visit); assert.equal((await saved(page)).cart[0].productId, "pastor")
    await button(page, "Ver pedido, 1 productos").click(); await page.locator(".r-regional-warning").waitFor(); assert(await button(page, "Continuar con el pedido").isDisabled())
    await audit(page); await page.screenshot({ path: path.join(output, "carrito-especialidad-otro-local.png") })
    await button(page, "Quitar Tacos al pastor").click(); await button(page, "Explorar la carta").click()
    await button(page, "Elegir Brisket estilo Texas").click(); await button(dialog(page), "Añadir al pedido · $285").click()
    await button(page, "Ver pedido, 1 productos").click(); await button(page, "Continuar con el pedido").click()
    await page.getByLabel("Local del pedido · demo", { exact: true }).selectOption("san-francisco"); assert(await button(page, "Simular pedido · $285").isDisabled())
    await page.getByLabel("Local del pedido · demo", { exact: true }).selectOption("austin"); await button(page, "Simular pedido · $285").click()
    await page.getByRole("heading", { name: "En preparación", exact: true }).waitFor(); const order = (await saved(page)).order
    assert.equal(order.pointId, "austin"); assert.equal(order.quote.total, 285)
    await page.reload(); await page.getByRole("heading", { name: "En preparación", exact: true }).waitFor()
    assert.equal((await saved(page)).order.id, order.id); assert.equal((await saved(page)).order.rows[0].productId, "brisket")
    await audit(page); await bounds(page)
  })
  await run("País y estado sincronizan mapa real y lista sin cambiar el local activo", { viewport: { width: 1440, height: 950 } }, async ({ page, context, mapRequests }) => {
    await context.route("https://tiles.openfreemap.org/styles/liberty", route => route.fulfill({ json: minimalMap }))
    await page.goto(`${base}/restaurante/locales`); await button(page, "Mostrar mapa interactivo").click()
    await page.locator(".r-map-surface.is-ready").waitFor({ timeout: 20000 }); assert.equal(await page.locator(".r-local-marker").count(), 16)
    await geo(page, 1440, "us"); await page.waitForFunction(() => document.querySelectorAll(".r-local-marker").length === 4); await page.locator(".r-map-surface.is-ready").waitFor(); assert.equal(await page.locator(".r-local-marker").count(), 4)
    await geo(page, 1440, "us", "texas"); await page.waitForFunction(() => document.querySelectorAll(".r-local-marker").length === 2); await page.locator(".r-map-surface.is-ready").waitFor(); assert.equal(await page.locator(".r-local-marker").count(), 2)
    await page.locator('[data-local="san-antonio"]').getByRole("button", { name: "Mostrar en el mapa", exact: true }).click()
    await page.locator(".r-map-selection").getByText("En el mapa: San Antonio · Brackenridge", { exact: true }).waitFor()
    assert((await page.locator(".r-service-bar").innerText()).includes("CDMX · Chapultepec"))
    await geo(page, 1440, "us", "california"); await page.waitForFunction(() => document.querySelectorAll(".r-local-marker").length === 2); await page.locator(".r-map-surface.is-ready").waitFor(); assert.equal(await page.locator(".r-local-marker").count(), 2)
    const requests = mapRequests.length; await page.waitForTimeout(1100); assert.equal(mapRequests.length, requests)
    await audit(page); await bounds(page); await page.screenshot({ path: path.join(output, "mapa-estados-motor.png") })
  })
  await run("Ocho fichas nuevas, reserva independiente y QR en un parque estadounidense", { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }, async ({ page }) => {
    for (const id of newPoints) {
      await page.goto(`${base}/restaurante/locales/${id}`); await page.locator(".r-local-detail h1").waitFor()
      assert((await page.locator("main").innerText()).includes("No existe un restaurante")); await bounds(page)
      assert((await page.locator(".r-service-bar").innerText()).includes("CDMX · Chapultepec"))
    }
    await button(page, "Reservar aquí").click(); assert((await dialog(page).innerText()).includes("San Francisco · Golden Gate")); await page.keyboard.press("Escape")
    await page.locator(".r-qr-section summary").click(); await page.getByLabel("Tipo de acceso", { exact: true }).selectOption("9"); await button(page, "Generar QR").click()
    await page.locator(".r-share-link a").click(); await button(dialog(page), "Sentarme en la mesa 9 · demo").click()
    await page.getByRole("heading", { name: "Mesa 9", exact: true }).waitFor(); assert.equal((await saved(page)).visit.pointId, "san-francisco")
    await button(page, "Elegir mi comida").click(); await category(page, 390, "Sabores de la región")
    await page.locator('[data-product="chowder"] img').evaluate(el => el.decode()); await audit(page); await bounds(page)
  })
  await run("Filtros de enlace, historial y crédito de fotografías locales", { viewport: { width: 1440, height: 950 } }, async ({ page }) => {
    await page.goto(`${base}/restaurante/locales?pais=us&estado=california&ciudad=Austin%2C+Texas`); await page.locator(".r-local-card").first().waitFor()
    await page.waitForFunction(() => document.querySelectorAll(".r-local-card").length === 2); assert.equal(await page.locator(".r-local-card").count(), 2)
    await geo(page, 1440, "us", "texas"); await page.goBack(); await page.locator('[data-local="los-angeles"]').waitFor(); await page.waitForFunction(() => document.querySelectorAll(".r-local-card").length === 4); assert.equal(await page.locator(".r-local-card").count(), 4)
    await page.goBack(); await page.locator('[data-local="los-angeles"]').waitFor(); await page.waitForFunction(() => document.querySelectorAll(".r-local-card").length === 2); assert.equal(await page.locator(".r-local-card").count(), 2)
    await page.goto(`${base}/restaurante/carta?categoria=Platos`); await page.locator('[data-product="pasta"]').waitFor(); await page.waitForFunction(() => document.querySelectorAll(".r-menu-item").length === 3); assert.equal(await page.locator(".r-menu-item").count(), 3)
    const registry = JSON.parse(await fs.readFile("public/restaurante/fotos-origen-v4.2.5.json", "utf8"))
    assert.equal(registry.length, 31)
    for (const item of registry) {
      assert.equal(createHash("sha256").update(await fs.readFile(`public/restaurante/${item.file}`)).digest("hex"), item.sha256)
      await page.evaluate(async src => { const image = new Image(); image.src = src; await image.decode(); if (!image.naturalWidth) throw new Error(src) }, `/restaurante/${item.file}`)
    }
    await page.locator('a[href="/restaurante/creditos-fotos.html"]').click(); await page.getByRole("heading", { name: "Fotografías de la carta", exact: true }).waitFor()
    assert.equal(await page.locator("tbody tr").count(), 31); await audit(page); await bounds(page)
  })
})
