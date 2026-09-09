import { describe, expect, it, vi } from "vitest"
import { readTheme, saveTheme, THEME_STORAGE_KEY } from "../src/utils/themeStorage"
import { contrastRatio, contrastingText, dialogAccent } from "../src/utils/colors"

describe("Preferencia de tema y contraste de controles", () => {
  it("recupera un tema válido y descarta valores corruptos", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "clinico")
    expect(readTheme()).toBe("clinico")
    localStorage.setItem(THEME_STORAGE_KEY, "constructor")
    expect(readTheme()).toBe("calido")
  })
  it("funciona cuando el navegador bloquea el almacenamiento", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new DOMException("Bloqueado", "SecurityError") })
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new DOMException("Sin cuota", "QuotaExceededError") })
    expect(readTheme()).toBe("calido")
    expect(() => saveTheme("naturaleza")).not.toThrow()
  })
  it.each(["#6B8F71", "#0A0A0A", "#2C4A7C", "#5A8C5A"])("mantiene legibilidad del acento %s en diálogos oscuros", color => {
    const accent = dialogAccent(color)
    expect(contrastRatio(accent, "#16181d")).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio(accent, contrastingText(accent))).toBeGreaterThanOrEqual(4.5)
  })
})
