import { act } from "react"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it } from "vitest"
import ThemeCalido from "../src/giros/psicologo/themes/ThemeCalido"
import ThemeMinimalista from "../src/giros/psicologo/themes/ThemeMinimalista"
import ThemeClinico from "../src/giros/psicologo/themes/ThemeClinico"
import ThemeNaturaleza from "../src/giros/psicologo/themes/ThemeNaturaleza"
import PsicologoApp from "../src/giros/psicologo/PsicologoApp"
import App from "../src/App"
import { button, click, render } from "./helpers"

describe("Integración de los cuatro temas", () => {
  it.each([
    ["Cálido", ThemeCalido], ["Minimalista", ThemeMinimalista],
    ["Clínico", ThemeClinico], ["Naturaleza", ThemeNaturaleza],
  ])("%s conecta contacto, servicios, menú y privacidad", async (_name, Theme) => {
    await render(<Theme />)
    expect(document.querySelectorAll("main").length).toBe(1)
    expect(document.querySelectorAll('a[href*="521234567890"]').length).toBe(0)
    expect(document.querySelectorAll("#contacto form input").length).toBe(2)
    expect(document.querySelector("#resenas").textContent).toContain("Reseñas ficticias")
    await click([...document.querySelectorAll("#contacto button")].find(node => node.textContent.includes("WhatsApp")))
    expect(document.querySelector("dialog").textContent).toContain("WhatsApp de demostración")
    await click(button("Cerrar ventana"))
    await click(document.querySelectorAll("#servicios button")[2])
    expect(document.querySelector("dialog").textContent).toContain("Orientación Psicológica")
    expect(document.querySelector("dialog").textContent).not.toContain("Presencial")
    await click(button("Cerrar ventana"))
    await click(button("Abrir menú"))
    expect(document.querySelectorAll("dialog a").length).toBe(5)
    await click(button("Cerrar ventana"))
    await click(button("Aviso de privacidad"))
    expect(document.querySelector("dialog").textContent).toContain("Google Fonts")
    expect(document.querySelector("dialog").textContent).toContain("Unsplash")
  })

  it("se recupera de un tema guardado inválido y permite seleccionar otro", async () => {
    localStorage.setItem("demo-psicologo-theme", "constructor")
    await render(<MemoryRouter><PsicologoApp /></MemoryRouter>)
    expect(button("Tema Cálido").getAttribute("aria-pressed")).toBe("true")
    await click(button("Tema Naturaleza"))
    expect(localStorage.getItem("demo-psicologo-theme")).toBe("naturaleza")
    expect(button("Tema Naturaleza").getAttribute("aria-pressed")).toBe("true")
  })

  it("una ruta desconocida muestra una salida funcional al portafolio", async () => {
    window.history.replaceState(null, "", "/no-existe")
    await render(<App />)
    expect(document.querySelector("h1").textContent).toBe("Esta página no existe")
    await click(document.querySelector('a[href="/"]'))
    expect(document.querySelector("h1").textContent).toContain("Soy")
    expect(document.title).toContain("Portafolio")
  })

  it("el indicador de Inicio se recupera al volver arriba", async () => {
    await render(<ThemeCalido />)
    const sections = ["inicio", "sobre-mi", "servicios", "primera-cita", "contacto"]
    for (const [index, id] of sections.entries()) {
      document.getElementById(id).getBoundingClientRect = () => ({ top: index * 1000 - window.scrollY })
    }
    Object.defineProperty(window, "scrollY", { configurable: true, value: 1200 })
    await act(async () => { window.dispatchEvent(new Event("scroll")); await new Promise(resolve => requestAnimationFrame(resolve)) })
    expect(document.querySelector('nav a[href="#sobre-mi"]').getAttribute("aria-current")).toBe("location")
    Object.defineProperty(window, "scrollY", { configurable: true, value: 0 })
    await act(async () => { window.dispatchEvent(new Event("scroll")); await new Promise(resolve => requestAnimationFrame(resolve)) })
    expect(document.querySelector('nav a[href="#inicio"]').getAttribute("aria-current")).toBe("location")
    expect(document.querySelector('nav a[href="#sobre-mi"]').getAttribute("aria-current")).toBe(null)
  })
})
