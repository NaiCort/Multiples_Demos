import { describe, expect, it, vi } from "vitest"
import DemoContactForm from "../src/components/shared/DemoContactForm"
import { advance, button, click, enter, render } from "./helpers"

describe("Formulario de demostración", () => {
  it("asocia etiquetas y errores, y lleva el foco al primer campo incorrecto", async () => {
    await render(<DemoContactForm accentColor="#6B8F71" />)
    await click(button("Simular envío"))
    const name = document.querySelector('[name="nombre"]')
    expect(document.activeElement).toBe(name)
    for (const field of document.querySelectorAll("input, select, textarea")) {
      expect(document.querySelector(`label[for="${field.id}"]`)).not.toBeNull()
      expect(field.getAttribute("aria-invalid")).toBe("true")
      expect(document.getElementById(field.getAttribute("aria-describedby"))).not.toBeNull()
    }
    await enter(name, "Alex")
    expect(name.getAttribute("aria-invalid")).toBe("false")
  })

  it("procesa el ejemplo sin red, bloquea cambios y restituye el foco al reiniciar", async () => {
    vi.useFakeTimers()
    const network = vi.spyOn(window, "fetch")
    await render(<DemoContactForm accentColor="#6B8F71" />)
    await click(button("Rellenar con datos de ejemplo"))
    await click(button("Simular envío"))
    expect(document.querySelector('[name="nombre"]').disabled).toBe(true)
    await advance(750)
    expect(document.body.textContent).toContain("El formulario no ha enviado datos")
    expect(network).not.toHaveBeenCalled()
    await click(button("Reiniciar demo"))
    const name = document.querySelector('[name="nombre"]')
    expect(document.activeElement).toBe(name)
    expect(name.value).toBe("")
    expect(document.querySelector("form").hidden).toBe(false)
  })

  it("cancela el envío simulado al desmontar el tema", async () => {
    vi.useFakeTimers()
    const view = await render(<DemoContactForm accentColor="#6B8F71" />)
    await click(button("Rellenar con datos de ejemplo"))
    await click(button("Simular envío"))
    expect(vi.getTimerCount()).toBe(1)
    await view.unmount()
    expect(vi.getTimerCount()).toBe(0)
  })
})
