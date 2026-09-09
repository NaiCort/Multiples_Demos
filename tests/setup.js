import { afterEach, vi } from "vitest"

vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true)
afterEach(() => {
  vi.restoreAllMocks()
  vi.useRealTimers()
  document.body.style.overflow = ""
  localStorage.clear()
})

// JSDOM no implementa la capa superior ni el foco nativo de <dialog>.
// Este adaptador solo permite probar montaje, Escape, limpieza y estado;
// no sustituye una prueba visual en un navegador real.
HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", "") }
HTMLDialogElement.prototype.close = function () { this.removeAttribute("open") }
window.matchMedia = vi.fn(query => ({
  matches: query.includes("prefers-reduced-motion"),
  media: query, onchange: null,
  addListener: vi.fn(), removeListener: vi.fn(),
  addEventListener: vi.fn(), removeEventListener: vi.fn(), dispatchEvent: vi.fn(),
}))
window.scrollTo = vi.fn()
Element.prototype.scrollIntoView = vi.fn()
class Observer {
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal("IntersectionObserver", Observer)
vi.stubGlobal("ResizeObserver", Observer)
