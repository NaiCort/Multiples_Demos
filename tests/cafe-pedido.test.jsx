import { MemoryRouter, Route, Routes } from "react-router-dom"
import { describe, expect, it, vi } from "vitest"
import CafeApp from "../src/giros/cafe/CafeApp"
import { findItem } from "../src/giros/cafe/data/carta"
import {
  STORAGE_KEY,
  cartTotal,
  defaultConfig,
  initialState,
  load,
  pickupSlots,
  reducer,
  stageAt,
  unitPrice,
} from "../src/giros/cafe/state/pedido"
import { advance, button, click, enter, render } from "./helpers"

const latte = findItem("latte")
const renderCafe = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/cafe/*" element={<CafeApp />} />
      </Routes>
    </MemoryRouter>,
  )

describe("Pedido de Ladera: estado", () => {
  it("suma extras de leche y shots y agrupa líneas iguales", () => {
    const config = { ...defaultConfig(latte), leche: "avena", shots: 1 }
    expect(unitPrice(latte, config)).toBe(70 + 15 + 18)
    let state = reducer(initialState, { type: "add", itemId: "latte", config, cantidad: 1 })
    state = reducer(state, { type: "add", itemId: "latte", config, cantidad: 2 })
    expect(state.cart).toHaveLength(1)
    expect(state.cart[0].cantidad).toBe(3)
    expect(cartTotal(state.cart)).toBe(103 * 3)
  })

  it("no confirma sin nombre y bloquea agregar mientras hay un pedido en barra", () => {
    let state = reducer(initialState, { type: "add", itemId: "espresso", config: { shots: 0 } })
    expect(reducer(state, { type: "confirm", nombre: " ", hora: "Hoy, 9:00", now: 0 })).toBe(state)
    state = reducer(state, {
      type: "confirm",
      nombre: "Ana",
      hora: "Hoy, 9:00",
      now: 0,
      numero: "L-1",
    })
    expect(state.cart).toHaveLength(0)
    expect(state.order.total).toBe(45)
    expect(reducer(state, { type: "add", itemId: "latte", config: {} })).toBe(state)
    expect(stageAt(state.order, 30_000).id).toBe("barra")
    expect(stageAt(state.order, 61_000).id).toBe("lista")
  })

  it("ofrece horarios dentro del horario del local y salta al día siguiente al cerrar", () => {
    const morning = pickupSlots(new Date(2026, 10, 12, 9, 2))
    expect(morning[0]).toMatchObject({ texto: "Hoy, 9:15", pronto: true })
    expect(morning[1].texto).toBe("Hoy, 9:30")
    const sundayLate = pickupSlots(new Date(2026, 10, 15, 13, 58))
    expect(sundayLate[0].texto).toBe("Mañana, 7:40")
  })

  it("descarta datos guardados dañados o productos que ya no existen", () => {
    expect(load({ getItem: () => "{no es json" })).toEqual(initialState)
    const saved = JSON.stringify({ cart: [{ id: 1, itemId: "borrado", config: {}, cantidad: 1 }] })
    expect(load({ getItem: () => saved }).cart).toEqual([])
  })
})

describe("Pedido de Ladera: recorrido", () => {
  it("personaliza desde la carta, avisa y lleva el producto al pedido", async () => {
    await renderCafe("/cafe/carta")
    await click(button("Agregar Latte"))
    const dialog = document.querySelector("dialog")
    expect(dialog.textContent).toContain("Leche")
    await click(dialog.querySelector('input[value="avena"]'))
    expect(dialog.querySelector('button[type="submit"]').textContent).toContain("$85 MXN")
    await click(dialog.querySelector('button[type="submit"]'))
    expect(document.querySelector("dialog")).toBeNull()
    expect(document.querySelector(".l-toast").textContent).toContain("Latte agregado")
    expect(document.querySelector(".l-cart-count").textContent).toBe("1")
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)).cart[0].config.leche).toBe("avena")
  })

  it("pide un nombre, simula el envío y muestra el seguimiento", async () => {
    vi.useFakeTimers()
    const network = vi.spyOn(window, "fetch")
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...initialState,
        cart: [
          { id: 1, itemId: "cortado", config: defaultConfig(findItem("cortado")), cantidad: 2 },
        ],
        nextLine: 2,
      }),
    )
    await renderCafe("/cafe/pedido")
    await click(button("Confirmar pedido"))
    expect(document.querySelector("#l-nombre").getAttribute("aria-invalid")).toBe("true")
    expect(document.activeElement.id).toBe("l-nombre")
    await enter(document.querySelector("#l-nombre"), "Ana")
    await click(button("Confirmar pedido"))
    expect(document.body.textContent).toContain("Enviando a la barra")
    await advance(800)
    expect(document.querySelector("h1").textContent).toBe("Tu pedido")
    expect(document.body.textContent).toContain("Simulación acelerada")
    expect(network).not.toHaveBeenCalled()
  })
})
