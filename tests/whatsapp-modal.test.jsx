import { StrictMode, act, useState } from "react"
import { describe, expect, it, vi } from "vitest"
import WhatsAppPreview from "../src/components/shared/WhatsAppPreview"
import Modal from "../src/components/shared/Modal"
import { advance, button, click, render } from "./helpers"

describe("Conversación y diálogos", () => {
  it("abrir, cerrar y reabrir rápidamente no mezcla conversaciones", async () => {
    vi.useFakeTimers()
    const scheduled = vi.spyOn(globalThis, "setTimeout")
    const cancelled = vi.spyOn(globalThis, "clearTimeout")
    const props = { onClose: () => {} }
    const view = await render(<WhatsAppPreview {...props} isOpen />)
    await click(button("Hola, tengo algunas dudas antes de agendar"))
    const timeoutIndex = scheduled.mock.calls.findIndex(call => call[1] === 750)
    expect(timeoutIndex).toBeGreaterThanOrEqual(0)
    const messageTimer = scheduled.mock.results[timeoutIndex].value
    await view.rerender(<WhatsAppPreview {...props} isOpen={false} />)
    expect(cancelled).toHaveBeenCalledWith(messageTimer)
    await view.rerender(<WhatsAppPreview {...props} isOpen />)
    await advance(800)
    expect(document.body.textContent).toContain("Elige qué mensaje enviarías")
    expect(document.body.textContent).not.toContain("Simulación completada")
    await click(button("Hola, ¿tienen disponibilidad esta semana?"))
    await advance(750)
    expect(document.body.textContent).toContain("No se ha enviado ningún mensaje")
    await click(button("Elegir otro mensaje"))
    expect(document.activeElement.tagName).toBe("FIELDSET")
  })

  it("tiene nombre accesible, admite Escape y restaura foco y desplazamiento", async () => {
    function Example() {
      const [open, setOpen] = useState(false)
      return <><button onClick={() => setOpen(true)}>Abrir prueba</button>{open && <Modal title="Ventana de prueba" onClose={() => setOpen(false)}><p>Contenido</p></Modal>}</>
    }
    await render(<StrictMode><Example /></StrictMode>)
    const opener = button("Abrir prueba")
    opener.focus()
    await click(opener)
    const dialog = document.querySelector("dialog")
    expect(dialog.open).toBe(true)
    expect(document.getElementById(dialog.getAttribute("aria-labelledby")).textContent).toBe("Ventana de prueba")
    expect(dialog.contains(document.activeElement)).toBe(true)
    expect(document.body.style.overflow).toBe("hidden")
    await act(async () => dialog.dispatchEvent(new Event("cancel", { cancelable: true })))
    expect(document.querySelector("dialog")).toBeNull()
    expect(document.activeElement).toBe(opener)
    expect(document.body.style.overflow).toBe("")
  })
})
