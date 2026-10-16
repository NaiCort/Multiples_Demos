import assert from "node:assert/strict"
import fs from "node:fs/promises"
import path from "node:path"
import { suite, audit, bounds, nav, button, dialog, saved } from "./restaurant-browser.mjs"

const motionName = locator => locator.evaluate(el => getComputedStyle(el).animationName)
async function images(page) {
  for (const image of await page.locator(".r-menu-item img").all()) {
    await image.scrollIntoViewIfNeeded(); await image.evaluate(el => el.decode())
    assert.equal(await image.evaluate(el => getComputedStyle(el).objectFit), "contain")
  }
}
await suite("restaurante-v424", async ({ run, base, output }) => {
  for (const [width, reducedMotion] of [[320, "no-preference"], [390, "no-preference"], [768, "no-preference"], [1440, "no-preference"], [390, "reduce"]]) {
    await run(`Carta, galerías, foco y carrito · ${width}px · ${reducedMotion}`, { viewport: { width, height: 900 }, reducedMotion, ...(width < 640 ? { isMobile: true, hasTouch: true } : {}) }, async ({ page }) => {
      const moving = reducedMotion === "no-preference"
      await page.goto(`${base}/restaurante`); await button(page, "Para llevar").click()
      await page.locator(".r-menu-item").first().waitFor()
      assert.equal(await motionName(page.locator(".r-page-content")), moving ? "r-page-enter" : "none")
      assert.equal(await page.evaluate(() => document.activeElement.tagName), "H1")
      await images(page); await bounds(page)
      const gallery = page.getByRole("group", { name: "Fotografías de Ensalada del patio", exact: true })
      const frame = gallery.locator(".r-gallery-frame"), originalBox = await frame.boundingBox()
      const next = button(gallery, "Foto siguiente de Ensalada del patio")
      await next.focus(); await page.keyboard.press("Enter")
      assert((await frame.locator("img").getAttribute("src")).includes("ensalada-2"))
      await frame.locator("img").evaluate(el => el.decode())
      assert.equal(await motionName(frame.locator("img")), moving ? "r-photo-next" : "none")
      assert(await next.evaluate(el => el === document.activeElement))
      const secondBox = await frame.boundingBox()
      assert(Math.abs(secondBox.height - originalBox.height) < 1 && Math.abs(secondBox.width - originalBox.width) < 1, "La foto no debe alargar el marco")
      assert(Math.abs(secondBox.width - secondBox.height) < 1, "La miniatura de la carta debe ser cuadrada")
      await button(gallery, "Foto anterior de Ensalada del patio").click()
      assert.equal(await motionName(frame.locator("img")), moving ? "r-photo-previous" : "none")
      const search = page.getByRole("searchbox", { name: "Buscar en la carta", exact: true })
      await search.fill("ensalada del patio"); assert.equal(await page.locator(".r-menu-item").count(), 1)
      assert(await search.evaluate(el => el === document.activeElement))
      assert.equal(await motionName(page.locator(".r-menu-results")), moving ? "r-results-enter" : "none")
      await search.fill("nada de esto existe"); await page.getByRole("heading", { name: "No encontramos ese antojo.", exact: true }).waitFor()
      await button(page, "Ver toda la carta").click(); await page.waitForFunction(() => document.querySelectorAll(".r-menu-item").length === 28)
      assert(await search.evaluate(el => el === document.activeElement))
      await button(page.locator(".r-menu-list"), "Elegir Ensalada del patio").click()
      const picker = dialog(page), photo = picker.locator(".r-gallery-frame")
      await photo.locator("img").evaluate(el => el.decode()); const pickerBox = await photo.boundingBox()
      assert(Math.abs(pickerBox.width / pickerBox.height - 4 / 3) < .01, "El producto conserva su marco 4:3")
      await button(picker, "Foto siguiente de Ensalada del patio").click(); await photo.locator("img").evaluate(el => el.decode())
      await audit(page); await bounds(page); await page.screenshot({ path: path.join(output, `producto-${width}-${reducedMotion}.png`) })
      await button(picker, "Añadir al pedido · $125").click()
      await page.waitForFunction(() => document.activeElement?.getAttribute("aria-label") === "Ver pedido, 1 productos")
      assert.equal(await motionName(page.locator(".r-cart-count")), moving ? "r-cart-arrival" : "none")
      assert((await page.locator(".r-announcement").innerText()).includes("Ensalada del patio: añadido al pedido."))
      assert.equal(await motionName(page.locator(".r-notice-card")), moving ? "r-notice-enter" : "none")
      const visit = (await saved(page)).visit.id
      await button(page.locator(".r-menu-list"), "Elegir Ensalada del patio").click(); await button(dialog(page), "Añadir al pedido · $125").click()
      assert.equal((await saved(page)).cart[0].quantity, 2)
      await button(page, "Ver pedido, 2 productos").click(); await page.locator(".r-panel-page h1").waitFor()
      assert.equal((await saved(page)).visit.id, visit)
      await nav(page, "Locales"); await nav(page, "Conócenos"); await nav(page, "La carta")
      assert.equal((await saved(page)).cart[0].quantity, 2); assert.equal((await saved(page)).visit.id, visit)
      await audit(page); await bounds(page); await button(page, "Ocultar aviso del pedido").click()
      await button(page, "Ver pedido, 2 productos").click(); await page.reload(); await page.locator(".r-panel-page h1").waitFor()
      assert.equal((await saved(page)).cart[0].quantity, 2); await audit(page)
      await page.screenshot({ path: path.join(output, `pedido-${width}-${reducedMotion}.png`) })
    })
  }
  await run("Movimiento reducido activado durante la visita y contador sin reiniciar galerías", { viewport: { width: 390, height: 844 }, reducedMotion: "no-preference", isMobile: true, hasTouch: true }, async ({ page, context }) => {
    await page.goto(`${base}/restaurante`); await button(page, "Comer aquí").click(); await button(page, "Explorar la carta mientras espero").click()
    const before = await saved(page)
    const gallery = page.getByRole("group", { name: "Fotografías de Ensalada del patio", exact: true })
    await button(gallery, "Foto siguiente de Ensalada del patio").click()
    await page.waitForTimeout(1_200)
    assert((await gallery.locator("img").getAttribute("src")).includes("ensalada-2"))
    assert.equal(await gallery.locator("img").evaluate(el => el.getAnimations().filter(animation => animation.playState === "running").length), 0)
    const after = await saved(page); assert.equal(after.visit.id, before.visit.id); assert.equal(after.visit.deadline, before.visit.deadline)
    await page.emulateMedia({ reducedMotion: "reduce" })
    await button(gallery, "Foto anterior de Ensalada del patio").click(); assert.equal(await motionName(gallery.locator("img")), "none")
    const frame = gallery.locator(".r-gallery-frame"); await frame.evaluate(el => el.scrollIntoView({ block: "center", behavior: "instant" })); await page.evaluate(() => document.fonts.ready)
    assert(await frame.evaluate(el => { const b = el.getBoundingClientRect(), hit = document.elementFromPoint(b.right - 20, b.top + 40); return hit && el.contains(hit) && !hit.closest("button") }), "El gesto debe comenzar sobre la foto visible, fuera de la barra fija y sus botones")
    const box = await frame.boundingBox(), cdp = await context.newCDPSession(page)
    const touch = (type, x, y) => cdp.send("Input.dispatchTouchEvent", { type, touchPoints: type === "touchEnd" ? [] : [{ x, y }] })
    await touch("touchStart", box.x + box.width - 20, box.y + 40); await touch("touchMove", box.x + 20, box.y + 43); await touch("touchEnd")
    await gallery.locator('img[src$="ensalada-2.webp"]').waitFor(); assert((await gallery.locator("img").getAttribute("src")).includes("ensalada-2"))
    await nav(page, "Conócenos"); assert.equal((await saved(page)).visit.deadline, before.visit.deadline)
    await page.locator(".r-timer-open").click(); await button(page, "Saltar espera de demostración").click()
    await page.getByRole("heading", { name: /^Mesa \d+$/ }).waitFor(); await audit(page); await bounds(page)
  })
  await run("Fotografías locales documentadas: archivos presentes, hashes y todas las vistas decodificables", { viewport: { width: 1440, height: 950 } }, async ({ page }) => {
    const registry = JSON.parse(await fs.readFile("public/restaurante/fotos-origen-v4.2.4.json", "utf8"))
    const { createHash } = await import("node:crypto")
    for (const item of registry) assert.equal(createHash("sha256").update(await fs.readFile(`public/restaurante/${item.file}`)).digest("hex"), item.sha256)
    await page.goto(`${base}/restaurante/carta`); await page.locator(".r-menu-item").first().waitFor(); await images(page)
    for (const gallery of await page.locator(".r-menu-list .r-gallery").all()) {
      const next = gallery.getByRole("button", { name: /^Foto siguiente/ })
      if (await next.count()) { await next.click(); await gallery.locator("img").evaluate(el => el.decode()) }
    }
    await audit(page); await bounds(page); await page.locator("main h1").focus(); await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" })); await page.screenshot({ path: path.join(output, "carta-fotos.png"), fullPage: true })
  })
})
