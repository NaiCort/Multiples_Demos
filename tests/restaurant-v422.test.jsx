import { MemoryRouter } from "react-router-dom"
import { describe, expect, it, vi } from "vitest"
import RestauranteApp from "../src/giros/restaurante/RestauranteApp"
import RestaurantProvider from "../src/giros/restaurante/state/RestaurantProvider"
import { cartReducer, cleanConfig, configSummary, dietaryTag, findProduct, lineKey, nutrition, unitPrice, ZONES } from "../src/giros/restaurante/data/order"
import { coveragePolygon, distanceKm, entryLink, exampleRoute, nearestPoint, parseEntry, POINTS, pointTime, routePosition } from "../src/giros/restaurante/data/locations"
import { upcomingDates } from "../src/giros/restaurante/data/reservation"
import { canOrder, createVisit, initialState, restaurantReducer, restoreState, serializeState } from "../src/giros/restaurante/state/model"
import { button, click, enter, render } from "./helpers"

const NOW = Date.parse("2026-10-15T18:00:00Z")
const app = (url = "/restaurante") => <MemoryRouter initialEntries={[url]}><RestaurantProvider><RestauranteApp /></RestaurantProvider></MemoryRouter>
function withCart(pointId = "xalapa") {
  let state = restaurantReducer(initialState(), { type: "start", visit: createVisit("delivery", 2, NOW, pointId) })
  return restaurantReducer(state, { type: "cart", action: { type: "add", productId: "pasta", quantity: 1, config: {} } })
}
const confirm = (state, zoneId = "centro") => restaurantReducer(state, { type: "confirm-order", id: "P12-V422-TEST", now: NOW, name: "Alex Demo", zoneId, address: "Destino ficticio 25", payment: "cash" })

describe("Configuración por receta y combos", () => {
  it("incluye suplementos de porción y combo en el precio y en los nutrientes", () => {
    const product = findProduct("pasta")
    const config = { choices: { size: "large" }, combo: { side: "ensalada", drink: "limonada" } }
    expect(unitPrice({ productId: "pasta", config })).toBe(195 + 65 + 55 + 10 + 10)
    expect(nutrition(product, config).kcal).toBeGreaterThan(nutrition(product).kcal * 1.5)
    expect(configSummary(product, config).join(" ")).toContain("Para compartir")
    expect(configSummary(product, config).join(" ")).toContain("Combo: Ensalada pequeña + Limonada")
  })
  it("distingue tamaños, combos y bebidas al editar y fusionar líneas", () => {
    const base = { type: "add", productId: "cafe", quantity: 1 }
    let rows = cartReducer([], base)
    rows = cartReducer(rows, { ...base, config: { choices: { temperature: "iced", size: "large" }, amounts: { azucar: "none" } } })
    expect(rows).toHaveLength(2)
    expect(unitPrice(rows[1])).toBe(57)
    expect(lineKey("pasta", { combo: { side: "sopa", drink: "agua" } })).not.toBe(lineKey("pasta"))
    rows = cartReducer(rows, { ...base, type: "edit", key: rows[1].key })
    expect(rows).toHaveLength(1); expect(rows[0].quantity).toBe(2)
  })
  it("no aplica controles de otra receta ni suplementos de ingredientes retirados", () => {
    expect(cleanConfig(findProduct("flan"), { choices: { size: "large", temperature: "iced" }, combo: { side: "sopa" } })).toMatchObject({ choices: {}, combo: null })
    const config = { swaps: { aderezo: "yogur" }, amounts: { vinagreta: "none" } }
    expect(unitPrice({ productId: "ensalada", config })).toBe(125)
    expect(configSummary(findProduct("ensalada"), config).join(" ")).not.toContain("yogur")
  })
  it("actualiza proteína y guarnición sin declarar vegana una hamburguesa con queso", () => {
    const burger = findProduct("hamburguesa")
    expect(dietaryTag(burger, { swaps: { proteina: "hongos" } })).toBe("vegetarian")
    expect(nutrition(burger, { swaps: { proteina: "doble" } }).protein - nutrition(burger).protein).toBe(30)
    expect(unitPrice({ productId: "hamburguesa", config: { swaps: { proteina: "doble" } } })).toBe(280)
  })
})
describe("Puntos, QR y cobertura", () => {
  it("ofrece ocho referencias distintas, rutas deterministas y cobertura cerrada", () => {
    expect(POINTS).toHaveLength(8)
    expect(new Set(POINTS.map(point => point.id)).size).toBe(8)
    POINTS.forEach(point => {
      expect(point.coordinates[0]).toBeLessThan(-86); expect(point.coordinates[1]).toBeGreaterThan(14)
      const route = exampleRoute(point.id, ZONES[1])
      expect(route[0]).toEqual(point.coordinates)
      expect(routePosition(route, 0)).toEqual(route[0]); expect(routePosition(route, 1)).toEqual(route.at(-1))
      expect(routePosition(route, 0.5)).not.toEqual(route[0])
      const ring = coveragePolygon(point.coordinates).geometry.coordinates[0]
      expect(distanceKm(ring[0], point.coordinates)).toBeCloseTo(5, 1)
      expect(ring.at(-1)[0]).toBeCloseTo(ring[0][0], 6)
    })
  })
  it("encuentra la referencia más cercana sin atribuir cobertura por distancia", () => {
    const closest = nearestPoint(POINTS[7].coordinates)
    expect(closest.point.id).toBe("tijuana"); expect(closest.distance).toBe(0)
  })
  it("los enlaces contienen solo punto y mesa válidos y rechazan enlaces manipulados", () => {
    const url = new URL(entryLink("puebla", 25, "https://multiples-demos.vercel.app"))
    expect([...url.searchParams.keys()]).toEqual(["punto", "mesa"])
    expect(parseEntry(url.searchParams)).toMatchObject({ valid: true, table: 25, point: { id: "puebla" } })
    for (const query of ["punto=xalapa&mesa=0", "punto=xalapa&mesa=26", "punto=xalapa&mesa=1.5", "mesa=7", "punto=constructor", "punto=xalapa&mesa=01"]) expect(parseEntry(new URLSearchParams(query)).valid).toBe(false)
    expect(parseEntry(new URLSearchParams("seguimiento=P12-PRUEBA"))).toBeNull()
  })
  it("QR de mesa ocupada evita la espera sin alterar el acceso normal", () => {
    const linked = createVisit("dine", 2, NOW, "merida", 25)
    expect(linked).toMatchObject({ table: 25, stage: "seated", deadline: null, fromQR: true })
    expect(canOrder({ visit: linked })).toBe(true)
    expect(createVisit("dine", 2, NOW, "merida").stage).toBe("waiting")
    expect(createVisit("dine", 2, NOW, "merida", 26).stage).toBe("waiting")
  })
  it("permite cambiar punto antes de confirmar y lo fija tras confirmar y recargar", () => {
    const state = withCart()
    const moved = restaurantReducer(state, { type: "point", pointId: "tijuana" })
    expect(moved.visit.pointId).toBe("tijuana"); expect(moved.cart).toEqual(state.cart)
    const confirmed = confirm(moved)
    expect(confirmed.order.pointId).toBe("tijuana")
    expect(restaurantReducer(confirmed, { type: "point", pointId: "puebla" })).toBe(confirmed)
    expect(restoreState(serializeState(confirmed), NOW + 35_000).order).toMatchObject({ pointId: "tijuana", zoneId: "centro", status: "delivering" })
  })
  it("rechaza entregas fuera de cobertura incluso si se omite la interfaz", () => {
    const state = withCart()
    expect(confirm(state, "fuera")).toBe(state)
    expect(confirm(state).order.quote.total).toBe(230)
  })
  it("migra sesiones V4.2.1, conserva la mesa y recupera un avance consistente", () => {
    const state = confirm(withCart())
    const legacy = JSON.parse(serializeState(state)); legacy.schema = 1
    delete legacy.pointId; delete legacy.visit.pointId; delete legacy.order.pointId; delete legacy.order.travelStartedAt
    const restored = restoreState(JSON.stringify(legacy), NOW + 35_000)
    expect(restored.order).toMatchObject({ id: state.order.id, pointId: "xalapa", status: "delivering", travelStartedAt: NOW + 30_000 })
    expect(restored.order.rows).toEqual(state.order.rows)
  })
  it("las fechas y horas usan el huso del punto y no el del dispositivo", () => {
    const moment = new Date("2026-10-16T06:30:00Z")
    expect(upcomingDates(moment, "America/Mexico_City")[0].id).toBe("2026-10-17")
    expect(upcomingDates(moment, "America/Tijuana")[0].id).toBe("2026-10-16")
    expect(pointTime("tijuana", moment)).not.toBe(pointTime("xalapa", moment))
  })
})
describe("Integración de V4.2.2", () => {
  it("abre un QR, sienta en la mesa correcta y conserva el mismo punto", async () => {
    await render(app("/restaurante?punto=puebla&mesa=7"))
    expect(document.querySelectorAll("dialog")).toHaveLength(1)
    await click(button("Sentarme en la mesa 7 · demo"))
    expect(document.querySelector("dialog").textContent).toContain("Mesa 7")
    expect(document.querySelector("dialog").textContent).toContain("Zócalo de Puebla")
    await click(button("Elegir mi comida"))
    expect(document.querySelector(".r-service-bar").textContent).toContain("Mesa 7")
  })
  it("un enlace inválido ofrece recuperación y solo un diálogo", async () => {
    await render(app("/restaurante?punto=xalapa&mesa=99"))
    expect(document.querySelectorAll("dialog")).toHaveLength(1)
    expect(document.querySelector("dialog").textContent).toContain("Este enlace no es válido")
    await click(button("Continuar con la demo")); expect(button("Para llevar")).toBeTruthy()
  })
  it("configura una bebida grande sin azúcar e identifica el precio en el carrito", async () => {
    await render(app()); await click(button("Para llevar"))
    await click(button("Elegir Limonada de la casa", document.querySelector(".r-menu-list")))
    await click(document.querySelector('input[name="choice-size"]:not(:checked)'))
    await enter(document.querySelector('select[aria-label="Cantidad de Azúcar"]'), "none")
    await click(button("Añadir al pedido · $70")); await click(button("Ver pedido, 1 productos"))
    expect(document.querySelector("dialog").textContent).toContain("Grande · 600 ml")
    expect(document.querySelector("dialog").textContent).toContain("Sin este ingrediente: Azúcar")
  })
  it("no solicita ubicación al abrir y permite seguir cuando se deniega", async () => {
    const getCurrentPosition = vi.fn((_ok, error) => error({ code: 1 }))
    Object.defineProperty(navigator, "geolocation", { configurable: true, value: { getCurrentPosition } })
    await render(app()); await click(button("Para llevar")); await click(button("Explorar puntos y mapa"))
    expect(getCurrentPosition).not.toHaveBeenCalled()
    expect(document.querySelectorAll(".r-point-list button")).toHaveLength(8)
    await click(button("Usar mi ubicación")); expect(getCurrentPosition).toHaveBeenCalledOnce()
    expect(document.querySelector("dialog").textContent).toContain("Ubicación no autorizada")
    expect(button("Mostrar mapa interactivo")).toBeTruthy()
  })
})
