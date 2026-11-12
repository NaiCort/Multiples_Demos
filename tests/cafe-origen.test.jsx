import { MemoryRouter, Route, Routes } from "react-router-dom"
import { describe, expect, it } from "vitest"
import CafeApp from "../src/giros/cafe/CafeApp"
import { bolsaPrecio, findItem } from "../src/giros/cafe/data/carta"
import { LOTES } from "../src/giros/cafe/data/lotes"
import { STORAGE_KEY, describeConfig, unitPrice } from "../src/giros/cafe/state/pedido"
import { button, click, render } from "./helpers"

const renderCafe = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/cafe/*" element={<CafeApp />} />
      </Routes>
    </MemoryRouter>,
  )

describe("Café en grano", () => {
  it("cobra la bolsa según su peso y describe la molienda", () => {
    const bolsa = findItem("bolsa-la-joya")
    expect(bolsa.precio).toBe(265)
    expect(unitPrice(bolsa, { peso: "250", molienda: "Moka" })).toBe(265)
    expect(unitPrice(bolsa, { peso: "1000", molienda: "Moka" })).toBe(bolsaPrecio(265, "1000"))
    expect(bolsaPrecio(265, "1000")).toBe(955)
    expect(describeConfig(bolsa, { peso: "1000", molienda: "Moka" })).toBe("1 kg · Moka")
  })

  it("aparece en la carta una bolsa por lote", async () => {
    await renderCafe("/cafe/carta")
    const grano = document.querySelector("#grano")
    expect(grano.querySelectorAll("li")).toHaveLength(LOTES.length)
    expect(grano.textContent).toContain("250 g · $240 MXN")
  })
})

describe("Origen", () => {
  it("muestra el perfil de altitud y una ficha por lote", async () => {
    await renderCafe("/cafe/origen")
    expect(document.querySelectorAll("h1")).toHaveLength(1)
    expect(document.querySelector(".l-profile").getAttribute("aria-label")).toContain("1,520 m")
    expect(document.querySelectorAll(".l-sheet")).toHaveLength(LOTES.length)
    expect(document.title).toContain("Origen")
  })

  it("compra una bolsa de 1 kg molida y la guarda en el pedido", async () => {
    await renderCafe("/cafe/origen")
    await click(button("Comprar bolsa de La Joya"))
    const dialog = document.querySelector("dialog")
    await click(dialog.querySelector('input[name="peso"][value="1000"]'))
    await click(dialog.querySelector('input[value="Prensa francesa"]'))
    expect(dialog.querySelector('button[type="submit"]').textContent).toContain("$955 MXN")
    await click(dialog.querySelector('button[type="submit"]'))
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)).cart[0]
    expect(saved).toMatchObject({
      itemId: "bolsa-la-joya",
      config: { peso: "1000", molienda: "Prensa francesa" },
    })
  })

  it("abre el gotero V60 con el lote de la ficha ya elegido", async () => {
    await renderCafe("/cafe/origen")
    const v60 = [...document.querySelectorAll("button")].filter(
      (node) => node.textContent === "Probarlo en gotero V60",
    )
    await click(v60[2])
    expect(document.querySelector('dialog input[name="lote"]:checked').value).toBe(LOTES[2].id)
  })
})
