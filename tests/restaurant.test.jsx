import { MemoryRouter } from "react-router-dom"
import { describe, expect, it, vi } from "vitest"
import RestauranteApp from "../src/giros/restaurante/RestauranteApp"
import OrderFlow from "../src/giros/restaurante/components/OrderFlow"
import TableReservation from "../src/giros/restaurante/components/TableReservation"
import { cartReducer, lineKey, subtotal } from "../src/giros/restaurante/data/order"
import { reservationTimes, upcomingDates } from "../src/giros/restaurante/data/reservation"
import { advance, button, click, enter, render } from "./helpers"

describe("Pedido de restaurante", () => {
  it("distingue extras, combina productos iguales y respeta límites sin alterar el carrito anterior", () => {
    const a = { type: "add", productId: "hamburguesa", extras: ["queso", "queso", "inexistente"], quantity: 2 }
    const rows = cartReducer([], a)
    expect(rows[0].extras).toEqual(["queso"])
    expect(subtotal(rows)).toBe(470)
    const combined = cartReducer(rows, { ...a, quantity: 3 })
    expect(combined[0].quantity).toBe(5)
    expect(rows[0].quantity).toBe(2)
    expect(cartReducer(combined, { ...a, quantity: 5 })).toBe(combined)
    const separate = cartReducer(combined, { ...a, extras: [], quantity: 1 })
    expect(separate).toHaveLength(2)
    expect(lineKey("pasta", ["pollo", "hongos"])).toBe(lineKey("pasta", ["hongos", "pollo"]))
    expect(cartReducer(separate, { type: "quantity", key: rows[0].key, quantity: 0 })).toBe(separate)
    expect(cartReducer(separate, { type: "remove", key: rows[0].key })).toHaveLength(1)
    expect(cartReducer(separate, { type: "add", productId: "constructor", quantity: 1 })).toBe(separate)
  })

  it("incluye el costo de entrega en la confirmación y vacía el pedido solo al terminar la simulación", async () => {
    vi.useFakeTimers()
    const dispatch = vi.fn()
    const rows = cartReducer([], { type: "add", productId: "hamburguesa", extras: ["queso"], quantity: 2 })
    await render(<OrderFlow cart={rows} dispatch={dispatch} onClose={() => {}} onMenu={() => {}} />)
    await click(button("Continuar con el pedido"))
    await click(document.querySelectorAll('input[type="radio"]')[1])
    expect(button("Simular pedido · $505").disabled).toBe(false)
    await click(button("Simular pedido · $505"))
    expect(document.body.textContent).toContain("Simulando pedido")
    expect(dispatch).not.toHaveBeenCalled()
    await advance(800)
    expect(document.body.textContent).toContain("Pedido simulado completado")
    expect(document.body.textContent).toContain("$505 MXN")
    expect(dispatch).toHaveBeenCalledWith({ type: "clear" })
  })

  it("cancela el pedido en procesamiento al desmontar y conserva el carrito", async () => {
    vi.useFakeTimers()
    const dispatch = vi.fn()
    const rows = cartReducer([], { type: "add", productId: "pasta", extras: [], quantity: 1 })
    const view = await render(<OrderFlow cart={rows} dispatch={dispatch} onClose={() => {}} onMenu={() => {}} />)
    await click(button("Continuar con el pedido"))
    await click(button("Simular pedido · $195"))
    await view.unmount()
    await advance(1000)
    expect(dispatch).not.toHaveBeenCalled()
  })
})

describe("Reserva de mesa", () => {
  it("ofrece seis fechas futuras sin lunes y limita mesas para grupos grandes", () => {
    const dates = upcomingDates(new Date(2026, 9, 4, 12))
    expect(dates).toHaveLength(6)
    expect(dates[0].id).toBe("2026-10-06")
    for (const date of dates) expect(new Date(date.id + "T12:00:00").getDay()).not.toBe(1)
    expect(reservationTimes("6").filter(slot => slot.available).map(slot => slot.time)).toEqual(["13:00", "19:00"])
  })

  it("invalida la hora al cambiar el grupo y permite confirmar y reiniciar", async () => {
    vi.useFakeTimers()
    await render(<TableReservation onClose={() => {}} />)
    const [people, date] = document.querySelectorAll("select")
    await enter(date, date.options[1].value)
    await click(button("Ver horarios"))
    await click(button("14:30Disponible"))
    await click(button("Cambiar fecha o personas"))
    await enter(people.isConnected ? people : document.querySelector("select"), "6")
    await click(button("Ver horarios"))
    expect(button("14:30Sin mesas para este grupo").disabled).toBe(true)
    expect(button("Simular reserva").disabled).toBe(true)
    await click(button("19:00Disponible"))
    await click(button("Simular reserva"))
    await advance(800)
    expect(document.body.textContent).toContain("6 personas")
    expect(document.body.textContent).toContain("Reserva simulada completada")
    await click(button("Probar otra reserva"))
    expect(button("Ver horarios").disabled).toBe(true)
    expect(document.querySelector("select").value).toBe("2")
  })
})

describe("Carta y encuadre de restaurante", () => {
  it("filtra, busca sin acentos, recupera resultados vacíos y añade un plato", async () => {
    await render(<MemoryRouter><RestauranteApp /></MemoryRouter>)
    expect(document.querySelectorAll(".r-menu-item")).toHaveLength(12)
    await click(button("Bebidas"))
    expect(document.querySelectorAll(".r-menu-item")).toHaveLength(3)
    await enter(document.querySelector('input[type="search"]'), "cafe")
    expect(document.querySelectorAll(".r-menu-item")).toHaveLength(1)
    await enter(document.querySelector('input[type="search"]'), "xxxxxxxx")
    expect(document.body.textContent).toContain("No encontramos ese antojo")
    await click(button("Ver toda la carta"))
    expect(document.querySelectorAll(".r-menu-item")).toHaveLength(12)
    await click(button("Elegir Pasta de la casa", document.querySelector(".r-menu-list")))
    await click(button("Añadir al pedido · $195"))
    expect(button("Ver pedido, 1 productos")).toBeTruthy()
    await click(button("Cómo funciona esta demo"))
    expect(document.querySelector("dialog").textContent).toContain("Patio 12")
    expect(document.querySelector("dialog").textContent).not.toContain("Cambia el estilo")
    expect(document.title).toContain("Patio 12")
  })
})
