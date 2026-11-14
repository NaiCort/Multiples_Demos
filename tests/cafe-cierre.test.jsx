import { MemoryRouter, Route, Routes } from "react-router-dom"
import { describe, expect, it } from "vitest"
import CafeApp from "../src/giros/cafe/CafeApp"
import { ITEMS, alergenosTexto, findItem } from "../src/giros/cafe/data/carta"
import { CATA_KEY } from "../src/giros/cafe/state/cata"
import { STORAGE_KEY } from "../src/giros/cafe/state/pedido"
import { button, click, render } from "./helpers"

const renderCafe = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/cafe/*" element={<CafeApp />} />
      </Routes>
    </MemoryRouter>,
  )

describe("Carta completa", () => {
  it("indica tamaño en ml o g en todo lo que no es café en grano", () => {
    for (const item of ITEMS.filter((i) => !i.id.startsWith("bolsa-")))
      expect(item.desc, item.id).toMatch(/\d+ (ml|g)\b/)
  })

  it("ajusta los alérgenos según la leche elegida", () => {
    const latte = findItem("latte")
    expect(alergenosTexto(latte)).toEqual(["lácteos"])
    expect(alergenosTexto(latte, { leche: "almendra" })).toEqual(["nueces"])
    expect(alergenosTexto(latte, { leche: "avena" })).toEqual(["posibles trazas de gluten"])
    expect(alergenosTexto(findItem("panque"))).toContain("nueces")
  })

  it("muestra alérgenos por producto y precios con IVA incluido", async () => {
    await renderCafe("/cafe/carta")
    expect(document.querySelectorAll(".l-menu .l-allergens").length).toBe(ITEMS.length)
    expect(document.body.textContent).toContain("con IVA incluido")
    expect(document.body.textContent).toContain("se puede sin lácteos")
  })
})

describe("Privacidad y cómo llegar", () => {
  it("abre el aviso desde el pie y borra los datos guardados de Ladera", async () => {
    localStorage.setItem(CATA_KEY, JSON.stringify({ codigo: "CATA-1", nombre: "Luis" }))
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ cart: [], order: null, nextLine: 1, visitas: 5 }),
    )
    await renderCafe("/cafe/visitanos")
    await click(button("Aviso de privacidad"))
    expect(document.querySelector("dialog").textContent).toContain("almacenamiento local")
    await click(button("Borrar mis datos de Ladera"))
    expect(localStorage.getItem(CATA_KEY)).toBeNull()
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)).visitas).toBe(0)
    expect(document.querySelector("h1").textContent).toContain("Café de ladera")
  })

  it("da indicaciones y explica el botón de mapas sin abrir un lugar real", async () => {
    await renderCafe("/cafe/visitanos")
    expect(document.querySelector("#como-llegar").textContent).toContain("Parque Juárez")
    await click(button("Abrir en mapas"))
    expect(document.querySelector("dialog").textContent).toContain("no se abre")
    expect(document.querySelectorAll('a[href*="maps"]')).toHaveLength(0)
  })
})
