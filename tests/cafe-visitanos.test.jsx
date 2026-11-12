import { MemoryRouter, Route, Routes } from "react-router-dom"
import { describe, expect, it, vi } from "vitest"
import CafeApp from "../src/giros/cafe/CafeApp"
import { SELLOS, initialState, reducer } from "../src/giros/cafe/state/pedido"
import { CATA_KEY, CUPO, disponibles, proximosSabados } from "../src/giros/cafe/state/cata"
import { advance, button, click, enter, render } from "./helpers"

const renderCafe = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/cafe/*" element={<CafeApp />} />
      </Routes>
    </MemoryRouter>,
  )
const order = {
  numero: "L-1",
  nombre: "Ana",
  hora: "Hoy, 9:00",
  lines: [],
  total: 0,
  confirmedAt: 0,
  status: "activo",
}

describe("Tarjeta de visitas y deshacer", () => {
  it("suma un sello al recoger, una sola vez, y lo conserva al reiniciar", () => {
    let state = reducer({ ...initialState, order }, { type: "pickup" })
    expect(state.visitas).toBe(1)
    expect(reducer(state, { type: "pickup" }).visitas).toBe(1)
    state = reducer(state, { type: "reset" })
    expect(state).toMatchObject({ order: null, visitas: 1 })
  })

  it("solo canjea con la tarjeta llena", () => {
    expect(reducer({ ...initialState, visitas: 3 }, { type: "canjear" }).visitas).toBe(3)
    expect(reducer({ ...initialState, visitas: SELLOS }, { type: "canjear" }).visitas).toBe(0)
  })

  it("devuelve una línea eliminada a su lugar", () => {
    let state = reducer(initialState, { type: "add", itemId: "espresso", config: { shots: 0 } })
    state = reducer(state, { type: "add", itemId: "latte", config: {} })
    const [first] = state.cart
    state = reducer(state, { type: "remove", id: first.id })
    state = reducer(state, { type: "restore", row: first, index: 0 })
    expect(state.cart.map((row) => row.itemId)).toEqual(["espresso", "latte"])
  })
})

describe("Cata de los sábados", () => {
  it("ofrece los cuatro sábados siguientes y lugares estables", () => {
    const fechas = proximosSabados(new Date(2026, 10, 12))
    expect(fechas.map((f) => f.iso)).toEqual([
      "2026-11-14",
      "2026-11-21",
      "2026-11-28",
      "2026-12-05",
    ])
    expect(proximosSabados(new Date(2026, 10, 14))[0].iso).toBe("2026-11-21")
    const libres = disponibles("2026-11-14", "10:00")
    expect(libres).toBe(disponibles("2026-11-14", "10:00"))
    expect(libres).toBeGreaterThan(0)
    expect(libres).toBeLessThanOrEqual(CUPO)
  })

  it("pide nombre, aparta el lugar, lo guarda y pide confirmación para cancelar", async () => {
    vi.useFakeTimers()
    await renderCafe("/cafe/visitanos")
    expect(document.title).toContain("Visítanos")
    const apartar = () =>
      [...document.querySelectorAll("button")].find((b) => b.textContent.startsWith("Apartar"))
    await click(apartar())
    expect(document.activeElement.id).toBe("l-cata-nombre")
    await enter(document.querySelector("#l-cata-nombre"), "Luis")
    await click(apartar())
    await advance(800)
    expect(document.body.textContent).toContain("Lugar apartado")
    expect(JSON.parse(localStorage.getItem(CATA_KEY)).nombre).toBe("Luis")
    await click(button("Cancelar la reserva"))
    await click(button("Mantener la reserva"))
    expect(localStorage.getItem(CATA_KEY)).not.toBeNull()
    await click(button("Cancelar la reserva"))
    await click(button("Sí, cancelar"))
    expect(localStorage.getItem(CATA_KEY)).toBeNull()
  })
})
