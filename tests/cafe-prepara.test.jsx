import { MemoryRouter, Route, Routes } from "react-router-dom"
import { describe, expect, it, vi } from "vitest"
import CafeApp from "../src/giros/cafe/CafeApp"
import { findGuia } from "../src/giros/cafe/data/guias"
import { STORAGE_KEY } from "../src/giros/cafe/state/pedido"
import { clock, ratio, scaled, stepIndex } from "../src/giros/cafe/state/guia"
import { advance, button, click, render } from "./helpers"

const renderCafe = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/cafe/*" element={<CafeApp />} />
      </Routes>
    </MemoryRouter>,
  )

describe("Recetas de Prepara en casa", () => {
  it("escala café, agua y los textos con el número de tazas", () => {
    const v60 = findGuia("v60")
    const doble = scaled(v60, 2)
    expect(doble).toMatchObject({ cafe: 30, agua: 500 })
    expect(doble.pasos[0].texto).toContain("90 g")
    expect(ratio(15, 250)).toBe("1:16.7")
    expect(ratio(20, 300)).toBe("1:15")
  })

  it("elige el paso según el tiempo y formatea el reloj", () => {
    const pasos = findGuia("v60").pasos
    expect(stepIndex(pasos, 0)).toBe(0)
    expect(stepIndex(pasos, 44)).toBe(0)
    expect(stepIndex(pasos, 46)).toBe(1)
    expect(stepIndex(pasos, 999)).toBe(pasos.length - 1)
    expect(clock(185.7)).toBe("3:05")
  })
})

describe("Temporizador", () => {
  it("cuenta, pausa, termina con una salida y permite repetir", async () => {
    vi.useFakeTimers()
    await renderCafe("/cafe/prepara")
    expect(document.title).toContain("Prepara en casa")
    await click(button("Iniciar temporizador"))
    await advance(50_000)
    expect(document.querySelector("[role=timer]").textContent).toContain("0:50")
    expect(document.querySelector(".l-steps .is-current").textContent).toContain("Vierte")
    await click(button("Pausar"))
    await advance(20_000)
    expect(document.querySelector("[role=timer]").textContent).toContain("0:50")
    await click(button("Continuar"))
    await advance(200_000)
    expect(document.querySelector(".l-timer-done").textContent).toContain("Listo")
    await click(button("Preparar otra vez"))
    expect(document.querySelector("[role=timer]").textContent).toContain("0:00")
  })

  it("reinicia al cambiar de método y ofrece el café molido para ese método", async () => {
    await renderCafe("/cafe/prepara")
    await click(document.querySelector('input[value="prensa"]'))
    expect(document.querySelector(".l-recipe").textContent).toContain("20 g")
    await click(button("Comprar El Encino molido para Prensa francesa"))
    const dialog = document.querySelector("dialog")
    expect(dialog.querySelector('input[name="molienda"]:checked').value).toBe("Prensa francesa")
    await click(dialog.querySelector('button[type="submit"]'))
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)).cart[0].itemId).toBe("bolsa-el-encino")
  })
})
