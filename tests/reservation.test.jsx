import { describe, expect, it, vi } from "vitest"
import ReservationFlow from "../src/components/shared/ReservationFlow"
import { SERVICE_RULES } from "../src/giros/psicologo/data/services"
import { advance, button, click, render } from "./helpers"

const props = { isOpen: true, onClose: () => {}, services: SERVICE_RULES, accentColor: "#0A0A0A" }
describe("Reserva simulada", () => {
  it("borra modalidad y horario al cambiar a un servicio exclusivamente online", async () => {
    await render(<ReservationFlow {...props} />)
    expect(button("Continuar").disabled).toBe(true)
    await click(button("Terapia Individual50 min / sesión"))
    await click(button("Continuar"))
    await click(button("Presencial"))
    await click(button("Lunes 10:00 am"))
    expect(button("Confirmar reserva").disabled).toBe(false)
    await click(button("Cambiar servicio"))
    await click(button("Orientación Psicológica45 min / sesión"))
    await click(button("Continuar"))
    expect(document.body.textContent).not.toContain("Presencial")
    expect(button("Online").getAttribute("aria-pressed")).toBe("false")
    expect(button("Lunes 10:00 am").getAttribute("aria-pressed")).toBe("false")
    expect(button("Confirmar reserva").disabled).toBe(true)
  })

  it("permite cambiar servicio tras preseleccionar, completar y reiniciar", async () => {
    vi.useFakeTimers()
    await render(<ReservationFlow {...props} preselectedService={SERVICE_RULES[2]} />)
    await click(button("Online"))
    await click(button("Viernes 12:00 pm"))
    await click(button("Confirmar reserva"))
    expect(button("Online").disabled).toBe(true)
    expect(button("Viernes 12:00 pm").disabled).toBe(true)
    await advance(800)
    expect(document.body.textContent).toContain("No se generó una reserva real.")
    await click(button("Reiniciar demo"))
    await click(button("Terapia de Pareja60 min / sesión"))
    await click(button("Continuar"))
    await click(button("Cambiar servicio"))
    expect(document.body.textContent).toContain("1 de 3")
  })

  it("cancela el temporizador al cerrar durante el procesamiento", async () => {
    vi.useFakeTimers()
    const scheduled = vi.spyOn(globalThis, "setTimeout")
    const cancelled = vi.spyOn(globalThis, "clearTimeout")
    const view = await render(<ReservationFlow {...props} preselectedService={SERVICE_RULES[0]} />)
    await click(button("Online"))
    await click(button("Miércoles 4:00 pm"))
    await click(button("Confirmar reserva"))
    const timeoutIndex = scheduled.mock.calls.findIndex(call => call[1] === 800)
    expect(timeoutIndex).toBeGreaterThanOrEqual(0)
    const reservationTimer = scheduled.mock.results[timeoutIndex].value
    await view.rerender(<ReservationFlow {...props} isOpen={false} />)
    expect(cancelled).toHaveBeenCalledWith(reservationTimer)
    await view.rerender(<ReservationFlow {...props} />)
    expect(document.body.textContent).toContain("1 de 3")
    expect(document.body.textContent).not.toContain("Reserva simulada.")
  })
})
