import { MemoryRouter, Route, Routes } from "react-router-dom"
import { describe, expect, it } from "vitest"
import PhotoGallery from "../src/giros/restaurante/components/PhotoGallery"
import RestauranteApp from "../src/giros/restaurante/RestauranteApp"
import RestaurantProvider from "../src/giros/restaurante/state/RestaurantProvider"
import { MENU, menuForPoint } from "../src/giros/restaurante/data/menu"
import { createVisit, initialState, restaurantReducer, restoreState, serializeState, STORAGE_KEY } from "../src/giros/restaurante/state/model"
import { button, click, enter, render } from "./helpers"

const salad = MENU.find(item => item.id === "ensalada")
const app = () => <MemoryRouter initialEntries={["/restaurante/carta"]}><RestaurantProvider><Routes><Route path="/restaurante/*" element={<RestauranteApp />} /></Routes></RestaurantProvider></MemoryRouter>

describe("Galería y respuesta visual de V4.2.4", () => {
  it("avanza, retrocede y vuelve al inicio sin perder el foco del control", async () => {
    const { container } = await render(<PhotoGallery product={salad} />)
    const next = button(`Foto siguiente de ${salad.name}`)
    const frame = container.querySelector(".r-gallery-frame")
    next.focus()
    await click(next)
    expect(frame.querySelector("img").getAttribute("src")).toBe(salad.photos[1].src)
    expect(document.activeElement).toBe(next)
    expect(document.getElementById(next.getAttribute("aria-controls"))).toBe(frame)
    await click(next)
    expect(frame.querySelector("img").getAttribute("src")).toBe(salad.photos[0].src)
    await click(button(`Foto anterior de ${salad.name}`))
    expect(frame.querySelector("img").getAttribute("src")).toBe(salad.photos[1].src)
    expect(container.querySelector('[aria-live="polite"]').textContent).toContain("Foto 2 de 2")
  })
  it("elegir la foto actual conserva la imagen y no reinicia su transición", async () => {
    const { container } = await render(<PhotoGallery product={salad} compact />)
    const original = container.querySelector("img")
    await click(button(`Foto 1 de ${salad.name}`))
    expect(container.querySelector("img")).toBe(original)
    await click(button(`Foto 2 de ${salad.name}`))
    expect(button(`Foto 2 de ${salad.name}`).getAttribute("aria-pressed")).toBe("true")
    expect(container.querySelectorAll("img")).toHaveLength(1)
  })
  it("un producto de una sola foto no ofrece controles que no llevan a otra vista", async () => {
    const single = MENU.find(item => item.photos.length === 1)
    const { container } = await render(<PhotoGallery product={single} />)
    expect(container.querySelectorAll("button")).toHaveLength(0)
    expect(container.querySelector("img").getAttribute("alt")).toContain(single.name)
  })
  it("recupera personalizaciones anteriores de ensalada con el mismo precio y visita", () => {
    const now = Date.now()
    const visit = createVisit("pickup", 2, now, "puebla")
    const started = restaurantReducer(initialState(), { type: "start", visit })
    const previous = restaurantReducer(started, { type: "cart", action: { type: "add", productId: "ensalada", quantity: 2, config: { amounts: { jitomate: "none", pepino: "little", vinagreta: "apart" } } } })
    const restored = restoreState(serializeState(previous), now + 1_000)
    expect(restored.visit.id).toBe(visit.id)
    expect(restored.cart).toEqual(previous.cart)
    expect(restored.cart[0].config.amounts).toEqual({ jitomate: "none", pepino: "little", vinagreta: "apart" })
    const confirmed = restaurantReducer(restored, { type: "confirm-order", id: "P12-V424-TEST", now: now + 1_000, name: "Alex Demo", payment: "cash" })
    expect(confirmed.order.quote.total).toBe(250)
    expect(confirmed.order.pointId).toBe("puebla")
  })
  it("filtrar y corregir la búsqueda conserva el foco y permite recuperar la carta vacía", async () => {
    await render(app())
    const search = document.querySelector('input[type="search"]')
    search.focus()
    await enter(search, "ensalada del patio")
    expect(document.querySelectorAll(".r-menu-item")).toHaveLength(1)
    expect(document.activeElement).toBe(search)
    await click(button(`Foto 2 de ${salad.name}`))
    const image = document.querySelector(".r-menu-item img")
    await enter(search, "ensalada del patio ")
    expect(document.querySelector(".r-menu-item img")).toBe(image)
    await enter(search, "no existe este platillo")
    expect(document.querySelectorAll(".r-menu-item")).toHaveLength(0)
    expect(document.activeElement).toBe(search)
    await click(button("Ver toda la carta"))
    expect(document.activeElement).toBe(search)
    expect(document.querySelectorAll(".r-menu-item")).toHaveLength(menuForPoint("chapultepec").length)
  })
  it("añadir el mismo plato dos veces confirma cada acción y conserva el pedido entre páginas", async () => {
    await render(app())
    await click(button("Elegir Pasta de la casa", document.querySelector(".r-menu-list")))
    await click(button("Para llevar", document.querySelector("dialog")))
    await click(button("Añadir al pedido · $195"))
    const first = document.querySelector(".r-announcement .r-notice-card")
    expect(first.textContent).toContain("añadido al pedido")
    await click(button("Elegir Pasta de la casa", document.querySelector(".r-menu-list")))
    await click(button("Añadir al pedido · $195"))
    expect(document.querySelector(".r-announcement .r-notice-card")).not.toBe(first)
    expect(button("Ver pedido, 2 productos")).toBeTruthy()
    await click(button("Ver pedido, 2 productos"))
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)).cart[0].quantity).toBe(2)
    expect(document.activeElement.tagName).toBe("H1")
    await click(button("Ocultar aviso del pedido"))
    expect(document.querySelector(".r-announcement").textContent).toBe("")
  })
})
