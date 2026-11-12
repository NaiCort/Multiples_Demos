// Reserva simulada de la cata de los sábados. Funciones puras; se guarda aparte del pedido.
export const CATA_KEY = "ladera-cata-v1"
export const HORARIOS_CATA = ["10:00", "12:00"]
export const CUPO = 8
export const PRECIO_CATA = 180

export function proximosSabados(now = new Date(), n = 4) {
  const day = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const ahead = (6 - day.getDay() + 7) % 7 || 7
  return Array.from({ length: n }, (_, i) => {
    const date = new Date(day.getFullYear(), day.getMonth(), day.getDate() + ahead + i * 7)
    const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
    return {
      iso,
      texto: date.toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" }),
    }
  })
}

// Lugares ya ocupados, de ejemplo y siempre iguales para la misma fecha y hora.
export function ocupados(iso, hora) {
  const seed = [...`${iso}${hora}`].reduce((sum, ch) => sum + ch.charCodeAt(0), 0)
  return seed % 7
}
export const disponibles = (iso, hora) => CUPO - ocupados(iso, hora)

export function loadCata(storage) {
  try {
    const saved = JSON.parse(storage?.getItem(CATA_KEY) || "null")
    return saved?.codigo ? saved : null
  } catch {
    return null
  }
}
export function saveCata(storage, reserva) {
  try {
    if (reserva) storage?.setItem(CATA_KEY, JSON.stringify(reserva))
    else storage?.removeItem(CATA_KEY)
  } catch {
    /* Sin almacenamiento, la reserva dura mientras la página siga abierta. */
  }
}
