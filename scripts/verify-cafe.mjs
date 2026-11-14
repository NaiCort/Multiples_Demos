import assert from "node:assert/strict"
import { suite, audit, bounds, button, dialog } from "./restaurant-browser.mjs"

const storage = (page) => page.evaluate(() => JSON.parse(localStorage.getItem("ladera-pedido-v1")))
const go = async (page, base, path) => {
  await page.goto(`${base}${path}`)
  await page.locator("main h1").waitFor()
}

await suite("cafe", async ({ run, base }) => {
  for (const width of [320, 390, 768, 1024, 1440])
    await run(
      `Recorrido completo de Ladera · ${width}px`,
      {
        viewport: { width, height: 900 },
        ...(width < 640 ? { isMobile: true, hasTouch: true } : {}),
        reducedMotion: width === 1440 ? "no-preference" : "reduce",
      },
      async ({ page }) => {
        await page.clock.install()
        for (const path of [
          "/cafe",
          "/cafe/carta",
          "/cafe/origen",
          "/cafe/prepara",
          "/cafe/visitanos",
          "/cafe/creditos",
        ]) {
          await go(page, base, path)
          assert.equal(await page.locator("h1").count(), 1, `Un h1 en ${path}`)
          await bounds(page)
          await audit(page)
        }

        await go(page, base, "/cafe")
        if (width === 1440) {
          await button(page, "Detener la cinta").click()
          assert.equal(await button(page, "Reanudar la cinta").getAttribute("aria-pressed"), "true")
        } else {
          assert.equal(await page.locator(".l-marquee-toggle").isVisible(), false, "Sin movimiento")
        }
        for (const img of await page.locator("main img").all()) {
          await img.scrollIntoViewIfNeeded()
          assert(
            await img.evaluate((el) => el.decode().then(() => el.naturalWidth > 0)),
            "Foto local",
          )
        }

        await go(page, base, "/cafe/carta")
        await button(page, "Agregar Latte").click()
        await dialog(page).getByRole("radio", { name: "Avena +$15" }).check()
        await button(page, "Agregar uno de shots extra").click()
        assert.match(await dialog(page).locator('button[type="submit"]').textContent(), /\$103 MXN/)
        await bounds(page)
        await audit(page)
        await dialog(page).locator('button[type="submit"]').click()
        await dialog(page).waitFor({ state: "detached" })

        await go(page, base, "/cafe/origen")
        await button(page, "Comprar bolsa de La Joya").click()
        await dialog(page).getByRole("radio", { name: /1 kg/ }).check()
        await dialog(page).getByRole("radio", { name: "Prensa francesa" }).check()
        await dialog(page).locator('button[type="submit"]').click()
        assert.equal((await storage(page)).cart.length, 2)

        await go(page, base, "/cafe/pedido")
        await page.getByRole("button", { name: "Eliminar Latte del pedido" }).click()
        await button(page, "Deshacer").click()
        assert.equal((await storage(page)).cart.length, 2, "Deshacer recupera la línea")
        await button(page, "Confirmar pedido").click()
        assert.equal(await page.locator("#l-nombre").getAttribute("aria-invalid"), "true")
        await page.fill("#l-nombre", "Ana")
        await button(page, "Confirmar pedido").click()
        await page.clock.runFor(1000)
        await page.locator(".l-stages").waitFor()
        await page.clock.runFor(61_000)
        await page.getByText("Tu pedido está listo.").waitFor()
        await audit(page)
        await page.reload()
        await page.getByText("Tu pedido está listo.").waitFor()
        await button(page, "Ya lo recogí").click()
        assert.equal((await storage(page)).visitas, 1, "Suma un sello")

        await go(page, base, "/cafe/prepara")
        await page.getByRole("radio", { name: "Chemex" }).check()
        await button(page, "Iniciar temporizador").click()
        await page.clock.runFor(50_000)
        assert.match(await page.locator(".l-steps .is-current").textContent(), /espiral/)
        await page.clock.runFor(300_000)
        await page.locator(".l-timer-done").waitFor()
        await bounds(page)

        await go(page, base, "/cafe/visitanos")
        await button(page, "Abrir en mapas").click()
        await dialog(page).getByText("no se abre").waitFor()
        await audit(page)
        await button(dialog(page), "Entendido").click()
        await page.locator("footer").getByRole("button", { name: "Aviso de privacidad" }).click()
        await dialog(page).getByText("almacenamiento local").waitFor()
        await bounds(page)
        await audit(page)
        await button(dialog(page), "Entendido").click()
        await page.fill("#l-cata-nombre", "Luis")
        await page.getByRole("button", { name: /Apartar 1 lugar/ }).click()
        await page.clock.runFor(1000)
        await page.getByText("Lugar apartado").waitFor()
        await button(page, "Cancelar la reserva").click()
        await button(page, "Sí, cancelar").click()
        await page.locator("#l-cata-nombre").waitFor()
        await audit(page)

        await page.goto(`${base}/`)
        assert.equal(await page.locator('a[href="/cafe"]').count(), 1, "La Bienvenida enlaza Café")
        return { width }
      },
    )
})
