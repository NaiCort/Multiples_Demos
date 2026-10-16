import { MemoryRouter, Routes, Route } from "react-router-dom"
import { describe, expect, it, vi } from "vitest"
import RestauranteApp from "../src/giros/restaurante/RestauranteApp"
import RestaurantProvider from "../src/giros/restaurante/state/RestaurantProvider"
import TableReservation from "../src/giros/restaurante/components/TableReservation"
import { MENU, menuForPoint } from "../src/giros/restaurante/data/menu"
import { allergens, cartReducer, dietaryTag, findProduct, lineKey, nutrition, subtotal } from "../src/giros/restaurante/data/order"
import { canOrder, createVisit, initialState, orderQuote, remainingSeconds, restaurantReducer, restoreState, serializeState, STORAGE_KEY } from "../src/giros/restaurante/state/model"
import { reservationTimes, upcomingDates } from "../src/giros/restaurante/data/reservation"
import { advance, button, click, enter, render } from "./helpers"
const NOW = new Date("2026-10-08T12:00:00Z").getTime()
const productAction = (config = {}, quantity = 1) => ({ type: "add", productId: "hamburguesa", config, quantity })
function session(mode = "pickup", member = false) {
  const visit = createVisit(mode, 2, NOW)
  let state = restaurantReducer(initialState(), { type: "start", visit })
  if (mode === "dine") state = restaurantReducer(state, { type: "skip-wait" })
  state = restaurantReducer(state, { type: "member", member })
  return restaurantReducer(state, { type: "cart", action: productAction() })
}
const confirm = (state, suffix = "A", now = NOW) => restaurantReducer(state, { type: "confirm-order", id: `P12-TEST-${suffix}`, now, name: "Alex Demo", address: "Calle ficticia 10", zoneId: "centro", payment: "digital" })
const app = () => <MemoryRouter initialEntries={["/restaurante"]}><RestaurantProvider><Routes><Route path="/restaurante/*" element={<RestauranteApp />} /></Routes></RestaurantProvider></MemoryRouter>

describe("Carta y configuraciones", () => {
  it("ofrece fotografías e ingredientes en toda la carta, sin valores nutricionales negativos", () => {
    expect(menuForPoint("chapultepec")).toHaveLength(28)
    MENU.forEach(product => { expect(product.photos.length).toBeGreaterThan(0); expect(product.ingredients.length).toBeGreaterThan(0); expect(Object.values(nutrition(product)).every(value => value >= 0)).toBe(true) })
  })
  it("limita cantidades, limpia extras inválidos y conserva el carrito anterior", () => {
    const rows = cartReducer([], productAction({ extras: ["queso", "queso", "inexistente"] }, 2))
    expect(rows[0].config.extras).toEqual(["queso"])
    expect(subtotal(rows)).toBe(470)
    const combined = cartReducer(rows, productAction({ extras: ["queso"] }, 3))
    expect(combined[0].quantity).toBe(5); expect(rows[0].quantity).toBe(2)
    expect(cartReducer(combined, productAction({ extras: ["queso"] }, 5))).toBe(combined)
    expect(cartReducer(rows, { type: "add", productId: "constructor", quantity: 1 })).toBe(rows)
    expect(cartReducer(rows, { type: "quantity", key: rows[0].key, quantity: 0 })).toBe(rows)
  })
  it("distingue ingredientes retirados y sustituciones, y ordena extras para la misma combinación", () => {
    expect(lineKey("pasta", { extras: ["pollo", "hongos"] })).toBe(lineKey("pasta", { extras: ["hongos", "pollo"] }))
    expect(lineKey("pasta", { amounts: { pesto: "none" } })).not.toBe(lineKey("pasta"))
    expect(lineKey("pasta", { swaps: { salsa: "jitomate" } })).not.toBe(lineKey("pasta"))
    const rows = cartReducer(cartReducer([], productAction()), productAction({ amounts: { cebolla: "none" } }))
    expect(rows).toHaveLength(2)
  })
  it("edita sin duplicar una línea y rechaza una fusión que sobrepase nueve unidades", () => {
    const rows = cartReducer(cartReducer([], productAction({}, 8)), productAction({ extras: ["queso"] }, 2))
    const edited = cartReducer(rows, { ...productAction({ amounts: { cebolla: "none" } }, 2), type: "edit", key: rows[1].key })
    expect(edited).toHaveLength(2); expect(edited[1].config.amounts.cebolla).toBe("none")
    expect(cartReducer(rows, { ...productAction({}, 2), type: "edit", key: rows[1].key })).toBe(rows)
  })
  it("actualiza nutrientes y categoría al añadir carne o retirar crema, conservando aviso de cocina", () => {
    const salad = findProduct("ensalada"), soup = findProduct("sopa")
    expect(dietaryTag(salad)).toBe("vegan")
    expect(dietaryTag(salad, { extras: ["pollo"] })).toBe("meat")
    expect(nutrition(salad, { extras: ["pollo"] }).protein).toBeGreaterThan(nutrition(salad).protein)
    expect(dietaryTag(soup, { amounts: { crema: "none" } })).toBe("vegan")
    expect(allergens(salad, { swaps: { aderezo: "yogur" } })).toContain("Leche")
    expect(allergens(salad, { amounts: { vinagreta: "none" } })).not.toContain("Mostaza")
  })
})
describe("Visita, pedidos y recuperación", () => {
  it("bloquea el pedido durante la espera y asigna una sola mesa al completar el minuto", () => {
    const visit = createVisit("dine", 3, NOW)
    const waiting = restaurantReducer(initialState(), { type: "start", visit })
    expect(canOrder(waiting)).toBe(false)
    expect(restaurantReducer(waiting, { type: "cart", action: productAction() }).cart).toHaveLength(0)
    expect(remainingSeconds(visit.deadline, NOW)).toBe(60)
    expect(restaurantReducer(waiting, { type: "tick", now: NOW + 59_999 }).visit.stage).toBe("waiting")
    const seated = restaurantReducer(waiting, { type: "tick", now: NOW + 60_000 })
    expect(canOrder(seated)).toBe(true); expect(seated.visit.table).toBeGreaterThanOrEqual(1); expect(seated.visit.table).toBeLessThanOrEqual(25)
    expect(restaurantReducer(seated, { type: "tick", now: NOW + 70_000 }).visit.table).toBe(seated.visit.table)
  })
  it("recupera el mismo pedido y mesa al regresar tarde desde otra pantalla", () => {
    const original = confirm(session("dine"))
    const restored = restoreState(serializeState(original), NOW + 40_000)
    expect(restored.order.id).toBe(original.order.id); expect(restored.order.status).toBe("ready"); expect(restored.visit.table).toBe(original.visit.table)
    expect(restored.order.rows).toEqual(original.order.rows)
  })
  it("mantiene un contador por hora de finalización y recupera entrega avanzada en segundo plano", () => {
    const original = confirm(session("delivery"))
    const restored = restoreState(serializeState(original), NOW + 65_000)
    expect(restored.order.status).toBe("delivered"); expect(restored.order.deadline).toBeNull()
    expect(remainingSeconds(NOW + 60_000, NOW + 60_100)).toBe(0)
  })
  it("separa preparación y distancia, y saltar preparación inicia el tramo de ruta correcto", () => {
    const order = confirm(session("delivery"))
    const moved = restaurantReducer(order, { type: "skip-stage", now: NOW + 1_000 })
    expect(moved.order.status).toBe("delivering"); expect(remainingSeconds(moved.order.deadline, NOW + 1_000)).toBe(20)
    expect(restaurantReducer(moved, { type: "skip-stage", now: NOW + 2_000 }).order.status).toBe("delivered")
  })
  it("conserva configuración al cambiar modalidad y evita cambiar un pedido confirmado", () => {
    const state = session()
    const changed = restaurantReducer(state, { type: "start", visit: createVisit("delivery", 2, NOW) })
    expect(changed.cart).toEqual(state.cart)
    const confirmed = confirm(changed)
    expect(restaurantReducer(confirmed, { type: "start", visit: createVisit("pickup", 2, NOW) })).toBe(confirmed)
    expect(restaurantReducer(confirmed, { type: "confirm-order", id: "P12-TEST-B", now: NOW })).toBe(confirmed)
  })
  it("calcula beneficios solo sobre platos, con costos por zona", () => {
    const state = session("delivery", true)
    expect(orderQuote(state.cart, "delivery", "centro", state.profile)).toEqual({ subtotal: 215, fee: 35, discount: 11, total: 239 })
    expect(orderQuote(state.cart, "delivery", "limite", { member: false, visits: 10 }).total).toBe(260)
  })
  it("registra una sola visita completada y permite regresar al recibo del perfil", () => {
    const confirmed = confirm(session("pickup", true))
    const ready = restaurantReducer(confirmed, { type: "tick", now: NOW + 30_000 })
    const finished = restaurantReducer(ready, { type: "complete", now: NOW + 31_000 })
    expect(finished.profile.visits).toBe(4); expect(finished.profile.history).toHaveLength(1); expect(finished.visit).toBeNull()
    expect(restaurantReducer(finished, { type: "complete", now: NOW + 32_000 })).toBe(finished)
    const restored = restoreState(serializeState(finished), NOW + 32_000)
    expect(restored.order).toBeNull(); expect(restored.profile.history[0].id).toBe(confirmed.order.id)
  })
  it("termina la sesión temporal del invitado sin persistir su recibo ni generar beneficios", () => {
    const ready = restaurantReducer(confirm(session()), { type: "tick", now: NOW + 30_000 })
    const finished = restaurantReducer(ready, { type: "complete", now: NOW + 31_000 })
    expect(finished.profile.history).toHaveLength(0); expect(finished.profile.visits).toBe(3)
    expect(restoreState(serializeState(finished), NOW + 32_000).order).toBeNull()
  })
  it("rechaza almacenamiento corrupto o expirado y restablece posiciones fuera de límites", () => {
    expect(restoreState("{roto", NOW)).toEqual(initialState())
    const state = session()
    const raw = JSON.parse(serializeState(state)); raw.widget = { x: 90, y: -8 }
    const restored = restoreState(JSON.stringify(raw), NOW)
    expect(restored.widget).toMatchObject({ x: 1, y: 0 })
    expect(restoreState(JSON.stringify(raw), NOW + 7 * 3_600_000).visit).toBeNull()
  })
})
describe("Integración de restaurante", () => {
  it("elige modalidad, filtra y personaliza sin acentos, y recupera resultados vacíos", async () => {
    await render(app())
    await click(button("Para llevar"))
    expect(document.querySelectorAll(".r-menu-item")).toHaveLength(menuForPoint("chapultepec").length)
    await click(button("Bebidas")); await enter(document.querySelector('input[type="search"]'), "cafe")
    expect(document.querySelectorAll(".r-menu-item")).toHaveLength(1)
    await enter(document.querySelector('input[type="search"]'), "xxxxxxxx")
    await click(button("Ver toda la carta")); expect(document.querySelectorAll(".r-menu-item")).toHaveLength(menuForPoint("chapultepec").length)
    await enter(document.querySelector('.r-diet-filter select'), "meat"); expect(document.querySelectorAll(".r-menu-item")).toHaveLength(menuForPoint("chapultepec").filter(item => dietaryTag(item) === "meat").length)
    await enter(document.querySelector('.r-diet-filter select'), "all")
    await click(button("Elegir Pasta de la casa", document.querySelector(".r-menu-list")))
    await enter(document.querySelector('select[aria-label="Cantidad de Pesto de albahaca"]'), "none")
    await click(button("Añadir al pedido · $195")); expect(button("Ver pedido, 1 productos")).toBeTruthy()
    const stored = restoreState(localStorage.getItem(STORAGE_KEY), Date.now()); expect(stored.cart[0].config.amounts.pesto).toBe("none")
  })
  it("permite explorar durante la espera, saltarla y añadir después de recibir mesa", async () => {
    vi.useFakeTimers(); vi.setSystemTime(NOW)
    await render(app()); await click(button("Comer aquí")); expect(document.body.textContent).toContain("01:00")
    await click(button("Explorar la carta mientras espero")); await click(button("Elegir Pasta de la casa", document.querySelector(".r-menu-list")))
    expect(button("Añadir al pedido · $195").disabled).toBe(true)
    await click(button("Ver mi espera")); await click(button("Saltar espera de demostración")); expect(document.querySelector(".r-panel-body").textContent).toContain("Tu mesa ya te espera")
    await click(button("Elegir mi comida")); await click(button("Elegir Pasta de la casa", document.querySelector(".r-menu-list")))
    expect(button("Añadir al pedido · $195").disabled).toBe(false)
  })
  it("finaliza un pedido digital ficticio y guarda el recibo sin repetir visitas al recargar", async () => {
    vi.useFakeTimers(); vi.setSystemTime(NOW)
    const handle = await render(app()); await click(button("Para llevar"))
    await click(button("Mi perfil · demo")); await click(document.querySelector('.r-option input[type="checkbox"]')); await click(button("Cerrar ventana"))
    await click(button("Elegir Pasta de la casa", document.querySelector(".r-menu-list"))); await click(button("Añadir al pedido · $195")); await click(button("Ver pedido, 1 productos")); await click(button("Continuar con el pedido"))
    await click(document.querySelector('input[type="radio"][name="payment"]:not(:checked)')); await click(button("Simular pedido · $185"))
    expect(document.querySelector(".r-panel-body").textContent).toContain("En preparación")
    await advance(30_000); await click(button("Confirmar recogida de ejemplo"))
    expect(document.querySelector(".r-panel-body").textContent).toContain("Visita finalizada")
    await handle.unmount(); await render(app()); await click(button("Para llevar")); await click(button("Mi perfil · demo"))
    expect(document.querySelector("dialog").textContent).toContain("4 visitas de ejemplo")
    expect(document.querySelectorAll(".r-history li")).toHaveLength(1)
  })
})
describe("Reservas futuras", () => {
  it("mantiene cierre de lunes y disponibilidad por tamaño de grupo", () => {
    const dates = upcomingDates(new Date("2026-10-04T12:00:00"))
    expect(dates).toHaveLength(6); expect(dates.every(date => new Date(`${date.id}T12:00:00`).getDay() !== 1)).toBe(true)
    expect(reservationTimes(6).filter(time => time.available).map(time => time.time)).toEqual(["13:00", "19:00"])
  })
  it("invalida el horario al modificar el grupo y no inicia la espera de mesa", async () => {
    await render(<TableReservation onClose={() => {}} />)
    await enter(document.querySelector('select[aria-label="Fecha de ejemplo"]') || document.querySelectorAll("select")[1], upcomingDates()[1].id)
    await click(button("Ver horarios")); await click([...document.querySelectorAll(".r-time")].find(el => el.textContent.includes("14:30"))); await click(button("Cambiar fecha o personas"))
    await enter(document.querySelector("select"), "6"); await click(button("Ver horarios"))
    expect(button("Simular reserva").disabled).toBe(true); expect([...document.querySelectorAll(".r-time")].find(el => el.textContent.includes("14:30")).disabled).toBe(true)
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })
})
