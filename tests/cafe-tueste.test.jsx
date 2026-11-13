import fs from "node:fs"
import path from "node:path"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { describe, expect, it } from "vitest"
import CafeApp from "../src/giros/cafe/CafeApp"
import { FOTOS } from "../src/giros/cafe/data/fotos"
import { estadoLocal } from "../src/giros/cafe/state/pedido"
import { button, click, render } from "./helpers"

const renderCafe = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/cafe/*" element={<CafeApp />} />
      </Routes>
    </MemoryRouter>,
  )

describe("Estado del local", () => {
  it("dice si está abierto y cuándo abre, según el horario de ejemplo", () => {
    expect(estadoLocal(new Date(2026, 10, 12, 9, 0))).toEqual({
      abierto: true,
      texto: "hasta las 20:00",
    })
    expect(estadoLocal(new Date(2026, 10, 12, 6, 30)).texto).toBe("abre hoy a las 7:30")
    expect(estadoLocal(new Date(2026, 10, 14, 21, 0)).texto).toBe("abre mañana a las 8:30")
    expect(estadoLocal(new Date(2026, 10, 15, 14, 0)).abierto).toBe(false)
  })
})

describe("Fotografías de Ladera", () => {
  it("existen en public, con medidas, texto alternativo, autor y licencia libre", () => {
    const origen = JSON.parse(
      fs.readFileSync(path.resolve("public/cafe/fotos/fotos-origen.json"), "utf8"),
    )
    for (const [id, foto] of Object.entries(FOTOS)) {
      expect(fs.existsSync(path.resolve("public", foto.src.slice(1))), id).toBe(true)
      expect(foto.alt.length).toBeGreaterThan(20)
      expect(foto.autor).toBeTruthy()
      expect(foto.licencia).toMatch(/^(CC0|CC BY|Public domain)/)
      expect(origen.find((o) => o.archivo === `${id}.webp`)?.sha256).toMatch(/^[0-9a-f]{64}$/)
    }
  })

  it("lista los créditos de cada foto con enlace a su página", async () => {
    await renderCafe("/cafe/creditos")
    expect(document.title).toContain("Créditos")
    const items = document.querySelectorAll(".l-credit-list li")
    expect(items).toHaveLength(Object.keys(FOTOS).length)
    for (const item of items)
      expect(item.querySelector('a[href*="commons.wikimedia.org"]')).not.toBeNull()
  })
})

describe("Portada Tueste", () => {
  it("muestra la foto principal, la cinta con pausa y el relieve", async () => {
    await renderCafe("/cafe")
    expect(document.querySelector(".l-hero-photo img").getAttribute("fetchpriority")).toBe("high")
    expect(document.querySelector(".l-marquee").textContent).toContain("Hoy en filtrado")
    const pausa = button("Detener la cinta")
    await click(pausa)
    expect(document.querySelector(".l-marquee").classList.contains("is-paused")).toBe(true)
    expect(button("Reanudar la cinta").getAttribute("aria-pressed")).toBe("true")
    expect(document.querySelector(".l-relief svg").getAttribute("aria-label")).toContain("Relieve")
    expect(document.querySelector('a[href="/cafe/creditos"]')).not.toBeNull()
  })
})
