import { describe, expect, it, vi } from "vitest"
import { MemoryRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom"
import RestauranteApp from "../src/giros/restaurante/RestauranteApp"
import RestaurantProvider from "../src/giros/restaurante/state/RestaurantProvider"
import { MENU, availableAt, categoryFromParam, menuForPoint } from "../src/giros/restaurante/data/menu"
import { COUNTRIES, DEFAULT_POINT, POINTS, entryLink, localLabel, locationFilters, nearestPoint, parseEntry, pointsInArea, pointTime } from "../src/giros/restaurante/data/locations"
import { dietaryTag } from "../src/giros/restaurante/data/order"
import { createVisit, initialState, restaurantReducer, restoreState, serializeState, STORAGE_KEY } from "../src/giros/restaurante/state/model"
import { button, click, enter, render } from "./helpers"

const NOW = Date.parse("2026-10-16T12:00:00Z")
const regionalAt = pointId => menuForPoint(pointId).find(item => item.pointIds)
const confirm = state => restaurantReducer(state, { type: "confirm-order", id: "P12-V425-TEST", now: NOW + 1000, name: "Alex Demo", payment: "cash" })
const withRegional = (pointId = DEFAULT_POINT) => restaurantReducer(restaurantReducer(initialState(), { type: "start", visit: createVisit("pickup", 2, NOW, pointId) }), { type: "cart", action: { type: "add", productId: regionalAt(pointId).id, quantity: 1 } })
function Probe() { const location = useLocation(), navigate = useNavigate(); return <><output data-testid="route">{location.pathname + location.search}</output><button type="button" onClick={() => navigate(-1)}>Atrás de prueba</button></> }
const app = url => <MemoryRouter initialEntries={[url]}><RestaurantProvider><Probe /><Routes><Route path="/restaurante/*" element={<RestauranteApp />} /></Routes></RestaurantProvider></MemoryRouter>

describe("Carta regional y conservación de pedidos", () => {
  it("cada local conserva los doce productos originales y ofrece una especialidad distinta, con foto e ingredientes", () => {
    const regionalIds = new Set()
    for (const point of POINTS) {
      const menu = menuForPoint(point.id)
      expect(menu).toHaveLength(28)
      for (const id of ["ensalada", "queso", "sopa", "pasta", "hamburguesa", "pollo", "tacos", "flan", "pastel", "limonada", "agua", "cafe"]) expect(menu.some(item => item.id === id)).toBe(true)
      const regional = menu.filter(item => item.pointIds)
      expect(regional).toHaveLength(1); regionalIds.add(regional[0].id)
      expect(regional[0].photos.length).toBeGreaterThan(0); expect(regional[0].ingredients.length).toBeGreaterThan(0)
      expect(availableAt(regional[0], point.id)).toBe(true)
    }
    expect(regionalIds.size).toBe(POINTS.length)
    expect(new Set(MENU.map(item => item.id)).size).toBe(MENU.length)
    expect(categoryFromParam("Platos")).toBe("Platos fuertes")
  })
  it("cambiar de local conserva un plato regional pero bloquea añadirlo, editarlo y confirmar en otro local", () => {
    const original = withRegional()
    const moved = restaurantReducer(original, { type: "point", pointId: "austin", now: NOW })
    expect(moved.cart).toEqual(original.cart)
    expect(confirm(moved)).toBe(moved)
    expect(restaurantReducer(moved, { type: "cart", action: { type: "add", productId: original.cart[0].productId, quantity: 1 } })).toBe(moved)
    expect(restaurantReducer(moved, { type: "cart", action: { type: "edit", ...original.cart[0], quantity: 2 } })).toBe(moved)
    expect(restoreState(serializeState(moved), NOW + 1000).cart).toEqual(original.cart)
    const back = restaurantReducer(moved, { type: "point", pointId: DEFAULT_POINT, now: NOW })
    expect(confirm(back).order.pointId).toBe(DEFAULT_POINT)
    const withoutRegional = restaurantReducer(moved, { type: "cart", action: { type: "remove", key: moved.cart[0].key } })
    const newLocalDish = restaurantReducer(withoutRegional, { type: "cart", action: { type: "add", productId: regionalAt("austin").id, quantity: 1 } })
    expect(confirm(newLocalDish).order.pointId).toBe("austin")
  })
  it("un recibo regional confirmado conserva producto, local y precio al recargar; no permite cambiar su local", () => {
    const confirmed = confirm(withRegional("san-francisco"))
    const restored = restoreState(serializeState(confirmed), NOW + 2000)
    expect(restored.order.rows).toEqual(confirmed.order.rows)
    expect(restored.order.quote).toEqual(confirmed.order.quote)
    expect(restored.order.pointId).toBe("san-francisco")
    expect(restaurantReducer(restored, { type: "point", pointId: "puebla", now: NOW })).toBe(restored)
  })
  it("una categoría regional y su búsqueda se actualizan al elegir otro local sin borrar los filtros", async () => {
    await render(app("/restaurante/carta?categoria=Sabores+de+la+regi%C3%B3n"))
    expect(document.querySelectorAll(".r-menu-item")).toHaveLength(1)
    expect(document.querySelector('[data-product="pastor"]')).not.toBeNull()
    await click(button("Cambiar local de la carta")); await enter(document.querySelector('select[aria-label="Local simulado"]'), "oaxaca"); await click(button("Usar este local"))
    expect(document.querySelector('[data-product="tlayuda"]')).not.toBeNull()
    expect(document.querySelector('[data-product="pastor"]')).toBeNull()
    expect(document.querySelector('[data-testid="route"]').textContent).toContain("categoria=Sabores")
  })
  it("búsqueda, preferencia y categoría se combinan; volver atrás recupera el filtro anterior", async () => {
    await render(app("/restaurante/carta"))
    await click(button("Desayunos")); expect(document.querySelectorAll(".r-menu-item")).toHaveLength(3)
    await enter(document.querySelector('select[aria-label="Preferencia"]'), "vegan")
    expect(document.querySelectorAll(".r-menu-item")).toHaveLength(0)
    await enter(document.querySelector('select[aria-label="Preferencia"]'), "all")
    await enter(document.querySelector('input[type="search"]'), "maiz")
    expect([...document.querySelectorAll(".r-menu-item")].every(item => item.textContent.includes("Huevos") || item.textContent.includes("Chilaquiles"))).toBe(true)
    await click(button("Bebidas")); await click(button("Atrás de prueba"))
    expect(button("Desayunos").getAttribute("aria-pressed")).toBe("true")
    expect(document.querySelector('input[type="search"]').value).toBe("maiz")
    expect(menuForPoint(DEFAULT_POINT).filter(item => dietaryTag(item) === "meat").length).toBeGreaterThan(2)
  })
  it("el carrito muestra y resuelve la incompatibilidad regional; también bloquea el pago si se cambia de local en el último paso", async () => {
    vi.useFakeTimers(); vi.setSystemTime(NOW)
    localStorage.setItem(STORAGE_KEY, serializeState(withRegional()))
    await render(app("/restaurante/pedido"))
    await click(button("Continuar con el pedido"))
    await enter(document.querySelector('select[aria-label="Local del pedido · demo"]'), "austin")
    expect(document.querySelector(".r-regional-warning").textContent).toContain("Tacos al pastor")
    expect([...document.querySelectorAll("button")].find(item => item.textContent.startsWith("Simular pedido")).disabled).toBe(true)
    await click(button("Volver a los platos"))
    expect(button("Continuar con el pedido").disabled).toBe(true)
    await click(button("Quitar Tacos al pastor"))
    expect(document.querySelector(".r-regional-warning")).toBeNull()
    expect(document.querySelector(".r-empty")).not.toBeNull()
  })
})

describe("Directorio internacional de locales", () => {
  it("incluye México y Estados Unidos con dos parques por cada estado estadounidense, husos y QR válidos", () => {
    expect(COUNTRIES.map(item => item.id)).toEqual(["mx", "us"])
    expect(pointsInArea({ country: "mx" }).length).toBeGreaterThan(8)
    for (const state of ["texas", "california"]) expect(pointsInArea({ country: "us", state })).toHaveLength(2)
    for (const point of pointsInArea({ country: "us" })) {
      expect(point.name).toMatch(/Park/)
      expect(pointTime(point.id, NOW)).toMatch(/^\d{2}:\d{2}$/)
      expect(nearestPoint(point.coordinates).point.id).toBe(point.id)
      expect(parseEntry(new URL(entryLink(point.id, 25, "https://example.test")).searchParams).point.id).toBe(point.id)
    }
  })
  it("valida filtros de URL y descarta estados o ciudades incompatibles sin inventar resultados vacíos", () => {
    expect(locationFilters(new URLSearchParams("pais=us&estado=california&ciudad=Austin%2C+Texas"))).toEqual({ country: "us", state: "california", city: "" })
    expect(locationFilters(new URLSearchParams("pais=mx&estado=texas"))).toEqual({ country: "mx", state: "", city: "" })
    expect(locationFilters(new URLSearchParams("estado=texas"))).toEqual({ country: "us", state: "texas", city: "" })
    expect(locationFilters(new URLSearchParams("pais=no-existe&estado=no-existe"))).toEqual({ country: "", state: "", city: "" })
  })
  it("país, estado y ciudad filtran las fichas, mantienen selección y reserva independientes, y permiten volver a todos", async () => {
    await render(app("/restaurante/locales"))
    expect(document.querySelectorAll(".r-local-card")).toHaveLength(POINTS.length)
    await click(button("Estados Unidos")); expect(document.querySelectorAll(".r-local-card")).toHaveLength(4)
    await click(button("Texas, Estados Unidos")); expect(document.querySelectorAll(".r-local-card")).toHaveLength(2)
    await enter(document.querySelector('select[aria-label="Filtrar locales por ciudad"]'), "Austin, Texas")
    expect(document.querySelectorAll(".r-local-card")).toHaveLength(1)
    expect(document.querySelector('[data-local="austin"]')).not.toBeNull()
    expect(document.querySelector(".r-service-bar").textContent).toContain(localLabel(DEFAULT_POINT))
    await click(button("California, Estados Unidos")); expect(document.querySelectorAll(".r-local-card")).toHaveLength(2)
    expect(document.querySelector('select[aria-label="Filtrar locales por ciudad"]').value).toBe("")
    await click(button("Atrás de prueba")); expect(document.querySelector('[data-local="austin"]')).not.toBeNull()
    await click(button("Ver todos los locales")); expect(document.querySelectorAll(".r-local-card")).toHaveLength(POINTS.length)
  })
})
