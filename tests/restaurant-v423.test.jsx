import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom"
import { describe, expect, it, vi } from "vitest"
import RestauranteApp from "../src/giros/restaurante/RestauranteApp"
import RestaurantProvider from "../src/giros/restaurante/state/RestaurantProvider"
import { DEFAULT_POINT, localLabel } from "../src/giros/restaurante/data/locations"
import { createVisit, initialState, restaurantReducer, restoreState, serializeState, STORAGE_KEY, WAIT_MS } from "../src/giros/restaurante/state/model"
import { button, click, enter, render } from "./helpers"

const NOW = Date.parse("2026-10-15T18:00:00Z")
function RouteProbe() { const location = useLocation(); return <output data-testid="route">{location.pathname + location.search}</output> }
const app = (url = "/restaurante") => <MemoryRouter initialEntries={[url]}><RestaurantProvider><RouteProbe /><Routes><Route path="/restaurante/*" element={<RestauranteApp />} /></Routes></RestaurantProvider></MemoryRouter>
const nav = path => document.querySelector(`.r-desktop-nav a[href="/restaurante${path}"]`)
const stored = () => restoreState(localStorage.getItem(STORAGE_KEY), Date.now())
function session(mode = "pickup", pointId = DEFAULT_POINT) {
  const started = restaurantReducer(initialState(), { type: "start", visit: createVisit(mode, 2, NOW, pointId) })
  return restaurantReducer(mode === "dine" ? restaurantReducer(started, { type: "skip-wait" }) : started, { type: "cart", action: { type: "add", productId: "pasta", quantity: 1 } })
}

describe("Contexto de local de V4.2.3", () => {
  it("inicia y reinicia en CDMX sin trasladar sesiones existentes ni recibos antiguos", () => {
    expect(initialState().pointId).toBe("chapultepec")
    expect(localLabel(DEFAULT_POINT)).toBe("CDMX · Chapultepec")
    expect(restoreState(serializeState(session("pickup", "merida")), NOW + 1_000).pointId).toBe("merida")
    const legacy = JSON.parse(serializeState(session())); legacy.schema = 1; delete legacy.pointId; delete legacy.visit.pointId
    expect(restoreState(JSON.stringify(legacy), NOW + 1_000).visit.pointId).toBe("xalapa")
    expect(restaurantReducer(session("pickup", "puebla"), { type: "reset" }).pointId).toBe("chapultepec")
  })
  it("cambiar el local de una mesa reinicia la espera y conserva carrito y vencimiento", () => {
    const original = session("dine")
    const moved = restaurantReducer(original, { type: "point", pointId: "puebla", now: NOW + 3_000 })
    expect(moved.visit).toMatchObject({ pointId: "puebla", stage: "waiting", table: null, deadline: NOW + 3_000 + WAIT_MS, expiresAt: original.visit.expiresAt, fromQR: false })
    expect(moved.cart).toEqual(original.cart)
    expect(restaurantReducer(original, { type: "point", pointId: "chapultepec", now: NOW + 3_000 })).toBe(original)
  })
  it("cambiar local para recoger conserva el turno de sesión; confirmar fija su local", () => {
    const original = session()
    const moved = restaurantReducer(original, { type: "point", pointId: "tijuana", now: NOW + 1_000 })
    expect(moved.visit.id).toBe(original.visit.id)
    expect(moved.cart).toEqual(original.cart)
    const confirmed = restaurantReducer(moved, { type: "confirm-order", id: "P12-V423-TEST", now: NOW, name: "Alex Demo", payment: "cash" })
    expect(confirmed.order.pointId).toBe("tijuana")
    expect(restaurantReducer(confirmed, { type: "point", pointId: "merida", now: NOW })).toBe(confirmed)
  })
})

describe("Páginas de restaurante", () => {
  it("Inicio presenta tres platos y modalidades sin bloquear la exploración", async () => {
    await render(app())
    expect(document.querySelector("dialog")).toBeNull()
    expect(document.querySelector(".r-service-bar").textContent).toContain("CDMX · Chapultepec")
    expect(document.querySelectorAll(".r-featured-item")).toHaveLength(3)
    expect(button("Comer aquí")).toBeTruthy(); expect(button("A domicilio")).toBeTruthy()
    await click(nav("/carta"))
    expect(document.querySelectorAll(".r-menu-item")).toHaveLength(12)
    expect(document.querySelector("dialog")).toBeNull()
    await click(button("Elegir Pasta de la casa", document.querySelector(".r-menu-list")))
    expect(document.querySelector("dialog").textContent).toContain("Cómo quieres comer")
    await click(button("Para llevar", document.querySelector("dialog")))
    expect(document.querySelector("dialog").textContent).toContain("Pasta de la casa")
    await click(button("Añadir al pedido · $195"))
    expect(stored().visit.pointId).toBe("chapultepec")
  })
  it("los filtros viajan en la URL y se conservan entre carrito, edición y regreso", async () => {
    await render(app("/restaurante/carta?categoria=Bebidas&buscar=cafe"))
    expect(document.querySelectorAll(".r-menu-item")).toHaveLength(1)
    await click(button("Elegir Café americano", document.querySelector(".r-menu-list")))
    await click(button("Para llevar", document.querySelector("dialog")))
    await click(button("Añadir al pedido · $45")); await click(button("Ver pedido, 1 productos"))
    expect(document.querySelector('[data-testid="route"]').textContent).toBe("/restaurante/pedido")
    await click(button("Editar Café americano")); await click(button("Guardar cambios · $45"))
    await click(button("Añadir otro plato"))
    expect(document.querySelector('[data-testid="route"]').textContent).toBe("/restaurante/carta?categoria=Bebidas&buscar=cafe")
    expect(document.querySelector('input[type="search"]').value).toBe("cafe")
    expect(document.querySelectorAll(".r-menu-item")).toHaveLength(1)
  })
  it("visitar una ficha o filtrar CDMX no cambia el local del pedido", async () => {
    await render(app("/restaurante/locales"))
    expect(document.querySelectorAll(".r-local-card")).toHaveLength(8)
    await enter(document.querySelector('select[aria-label="Filtrar locales por ciudad"]'), "Ciudad de México")
    expect(document.querySelectorAll(".r-local-card")).toHaveLength(2)
    await click(document.querySelector('a[href="/restaurante/locales/alameda"]'))
    expect(document.querySelector("h1").textContent).toContain("Alameda")
    expect(stored().pointId).toBe("chapultepec")
    await click(button("Pedir en este local")); await click(button("A domicilio", document.querySelector("dialog")))
    expect(stored().visit).toMatchObject({ pointId: "alameda", mode: "delivery" })
    expect(document.querySelectorAll(".r-menu-item")).toHaveLength(12)
  })
  it("una reserva futura puede elegir otro local sin modificar la visita actual", async () => {
    vi.useFakeTimers(); vi.setSystemTime(NOW)
    localStorage.setItem(STORAGE_KEY, serializeState(session("pickup", "puebla")))
    await render(app("/restaurante/locales/merida"))
    await click(button("Reservar aquí"))
    expect(document.querySelector("dialog").textContent).toContain("Mérida · Centro")
    await click(button("Cambiar local de la reserva"))
    await enter(document.querySelector('select[aria-label="Local simulado"]'), "tijuana")
    await click(button("Usar este local"))
    expect(document.querySelector("dialog").textContent).toContain("Tijuana · Morelos")
    expect(stored().visit.pointId).toBe("puebla")
    expect(stored().cart).toHaveLength(1)
  })
  it("cambiar de local una mesa pide revisar su nueva espera y mantiene los platos", async () => {
    vi.useFakeTimers(); vi.setSystemTime(NOW)
    localStorage.setItem(STORAGE_KEY, serializeState(session("dine")))
    await render(app("/restaurante/locales/merida"))
    await click(button("Usar este local en mi visita"))
    expect(document.querySelector("dialog").textContent).toContain("reinicia la espera")
    await click(button("Usar este local"))
    expect(stored().visit).toMatchObject({ pointId: "merida", stage: "waiting", table: null })
    expect(stored().cart).toHaveLength(1)
  })
  it("admite barras finales en las rutas sin perder título ni foco principal", async () => {
    await render(app("/restaurante/carta/"))
    expect(document.querySelectorAll(".r-menu-item")).toHaveLength(12)
    expect(document.title).toContain("La carta — Patio 12")
    expect(document.activeElement.tagName).toBe("H1")
  })
  it("recupera rutas de local inexistente sin borrar la sesión ni mostrar la carta duplicada", async () => {
    vi.useFakeTimers(); vi.setSystemTime(NOW)
    localStorage.setItem(STORAGE_KEY, serializeState(session()))
    await render(app("/restaurante/locales/no-existe"))
    expect(document.querySelector("h1").textContent).toContain("Ese local no está")
    expect(document.querySelectorAll("h1")).toHaveLength(1)
    expect(stored().cart).toHaveLength(1)
    await click(document.querySelector('a[href="/restaurante/locales"]'))
    expect(document.querySelectorAll(".r-local-card")).toHaveLength(8)
  })
})
