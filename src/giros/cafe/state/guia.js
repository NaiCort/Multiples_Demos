// Cálculos del temporizador de preparación: funciones puras.

export function scaled(guia, tazas) {
  const factor = tazas / guia.tazas.base
  return {
    cafe: Math.round(guia.cafe * factor),
    agua: Math.round(guia.agua * factor),
    pasos: guia.pasos.map((paso) => {
      const agua = Math.round(paso.agua * factor)
      return { ...paso, agua, texto: paso.texto.replace("{agua}", agua) }
    }),
  }
}

export function stepIndex(pasos, seconds) {
  let index = 0
  pasos.forEach((paso, i) => {
    if (seconds >= paso.at) index = i
  })
  return index
}

export const clock = (seconds) => {
  const s = Math.max(0, Math.floor(seconds))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`
}

export const ratio = (cafe, agua) => `1:${(agua / cafe).toFixed(1).replace(/\.0$/, "")}`
