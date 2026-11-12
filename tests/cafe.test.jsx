import { MemoryRouter, Route, Routes } from "react-router-dom"
import { describe, expect, it } from "vitest"
import CafeApp from "../src/giros/cafe/CafeApp"
import { contourLevels, contourLines } from "../src/giros/cafe/lib/contour"
import { LOTES, LOTE_SEMANA } from "../src/giros/cafe/data/lotes"
import { button, click, render } from "./helpers"

const renderCafe = (path = "/cafe") =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/cafe/*" element={<CafeApp />} />
      </Routes>
    </MemoryRouter>,
  )

describe("Curvas de nivel de Ladera", () => {
  it("dibuja una curva cada 50 metros hasta la altitud del lote", () => {
    expect(contourLevels(1380)).toEqual([
      800, 850, 900, 950, 1000, 1050, 1100, 1150, 1200, 1250, 1300, 1350,
    ])
    const lines = contourLines({ seed: 11, altitude: 1380 })
    expect(lines.map((line) => line.level)).toEqual(contourLevels(1380))
    for (const line of lines) expect(line.d).toMatch(/^M[\d.-]+ [\d.-]+C.*Z$/)
  })

  it("repite el mismo dibujo para la misma semilla y cambia con otra", () => {
    const a = contourLines({ seed: 11, altitude: 1380 })
    expect(contourLines({ seed: 11, altitude: 1380 })).toEqual(a)
    expect(contourLines({ seed: 12, altitude: 1380 })[0].d).not.toBe(a[0].d)
  })
})

describe("Datos de Ladera", () => {
  it("tiene un solo lote de la semana y lotes completos con identificador único", () => {
    expect(LOTES.filter((lote) => lote.semana)).toHaveLength(1)
    expect(new Set(LOTES.map((lote) => lote.id)).size).toBe(LOTES.length)
    for (const lote of LOTES) {
      expect(lote.altitud).toBeGreaterThan(1000)
      expect(lote.precio250).toBeGreaterThan(0)
      expect(lote.color).toMatch(/^#[0-9A-F]{6}$/)
    }
  })
})

describe("Inicio de Ladera", () => {
  it("muestra una sola página con un h1, la ficha del lote y el aviso de datos ficticios", async () => {
    await renderCafe()
    expect(document.querySelectorAll("main")).toHaveLength(1)
    expect(document.querySelectorAll("h1")).toHaveLength(1)
    expect(document.title).toContain("Ladera")
    const sheet = document.querySelector("#lote-semana")
    expect(sheet.textContent).toContain(LOTE_SEMANA.productor)
    expect(sheet.textContent).toContain("1,380 m")
    expect(document.body.textContent).toContain("Ladera es un café ficticio")
    expect(document.querySelectorAll('a[href="#"]')).toHaveLength(0)
  })

  it("abre WhatsApp como conversación simulada y la cierra", async () => {
    await renderCafe()
    await click(button("Escribir por WhatsApp"))
    expect(document.querySelector("dialog").textContent).toContain("Ladera")
    await click(button("Cerrar ventana"))
    expect(document.querySelector("dialog")).toBeNull()
  })

  it("redirige una ruta desconocida de la demo a Inicio", async () => {
    await renderCafe("/cafe/no-existe")
    expect(document.querySelector("h1").textContent).toContain("Café de ladera")
  })
})
