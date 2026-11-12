// Estado del pedido para recoger de Ladera: funciones puras, probadas sin navegador.
// Se guarda en el navegador solo para que el recorrido sobreviva a una recarga.
import { LECHES, PESOS, SHOT_EXTRA, bolsaPrecio, findItem } from "../data/carta"
import { LOTES, LOTE_SEMANA } from "../data/lotes"

export const STORAGE_KEY = "ladera-pedido-v1"
export const MAX_CANTIDAD = 9
// Tiempos acelerados para la demo: la bebida pasa por la barra en un minuto.
export const ETAPAS = [
  { id: "recibido", nombre: "Recibido", desde: 0 },
  { id: "barra", nombre: "En la barra", desde: 20_000 },
  { id: "lista", nombre: "Lista para recoger", desde: 60_000 },
]

export function defaultConfig(item) {
  const config = {}
  if (item.opciones.includes("leche")) config.leche = "entera"
  if (item.opciones.includes("shots")) config.shots = 0
  if (item.opciones.includes("azucar")) config.azucar = "Sin azúcar"
  if (item.opciones.includes("lote")) config.lote = LOTE_SEMANA.id
  if (item.opciones.includes("peso")) config.peso = "250"
  if (item.opciones.includes("molienda")) config.molienda = "Grano entero"
  return config
}

export function unitPrice(item, config = {}) {
  if (config.peso) return bolsaPrecio(item.precio, config.peso)
  const leche = LECHES.find((option) => option.id === config.leche)
  return item.precio + (leche?.extra || 0) + (config.shots || 0) * SHOT_EXTRA
}

export function describeConfig(item, config = {}) {
  const parts = []
  if (config.lote) parts.push(LOTES.find((lote) => lote.id === config.lote)?.nombre)
  if (config.leche)
    parts.push(`Leche ${LECHES.find((o) => o.id === config.leche)?.nombre.toLowerCase()}`)
  if (config.shots) parts.push(`${config.shots} shot${config.shots > 1 ? "s" : ""} extra`)
  if (config.azucar) parts.push(config.azucar)
  if (config.peso) parts.push(PESOS.find((peso) => peso.id === config.peso)?.nombre)
  if (config.molienda) parts.push(config.molienda)
  return parts.filter(Boolean).join(" · ")
}

const sameLine = (a, b) =>
  a.itemId === b.itemId && JSON.stringify(a.config) === JSON.stringify(b.config)

export const initialState = { cart: [], order: null, nextLine: 1 }

export function reducer(state, action) {
  switch (action.type) {
    case "add": {
      if (state.order && state.order.status !== "recogido") return state
      const line = { itemId: action.itemId, config: action.config, cantidad: action.cantidad || 1 }
      const existing = state.cart.find((row) => sameLine(row, line))
      if (existing)
        return {
          ...state,
          cart: state.cart.map((row) =>
            row === existing
              ? { ...row, cantidad: Math.min(MAX_CANTIDAD, row.cantidad + line.cantidad) }
              : row,
          ),
        }
      return {
        ...state,
        cart: [...state.cart, { ...line, id: state.nextLine }],
        nextLine: state.nextLine + 1,
      }
    }
    case "quantity":
      return {
        ...state,
        cart: state.cart
          .map((row) =>
            row.id === action.id
              ? { ...row, cantidad: Math.max(0, Math.min(MAX_CANTIDAD, action.cantidad)) }
              : row,
          )
          .filter((row) => row.cantidad > 0),
      }
    case "remove":
      return { ...state, cart: state.cart.filter((row) => row.id !== action.id) }
    case "confirm": {
      if (state.cart.length === 0 || !action.nombre?.trim() || !action.hora) return state
      return {
        ...state,
        cart: [],
        order: {
          numero: action.numero,
          nombre: action.nombre.trim().slice(0, 24),
          hora: action.hora,
          lines: state.cart,
          total: cartTotal(state.cart),
          confirmedAt: action.now,
          status: "activo",
        },
      }
    }
    case "pickup":
      return state.order ? { ...state, order: { ...state.order, status: "recogido" } } : state
    case "reset":
      return initialState
    default:
      return state
  }
}

export function cartTotal(cart) {
  return cart.reduce((sum, row) => {
    const item = findItem(row.itemId)
    return item ? sum + unitPrice(item, row.config) * row.cantidad : sum
  }, 0)
}
export const cartCount = (cart) => cart.reduce((sum, row) => sum + row.cantidad, 0)

export function stageAt(order, now) {
  const elapsed = Math.max(0, now - order.confirmedAt)
  return ETAPAS.filter((etapa) => elapsed >= etapa.desde).at(-1)
}

// Horario por día de la semana (0 = domingo), en minutos desde medianoche.
const HORARIO = { 0: [510, 840], 6: [480, 1200], default: [450, 1200] }
const PREP = 10
const STEP = 15
const pad = (n) => String(n).padStart(2, "0")
const label = (minutes) => `${Math.floor(minutes / 60)}:${pad(minutes % 60)}`

export function pickupSlots(now = new Date(), limit = 8) {
  for (let offset = 0; offset < 7; offset++) {
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset)
    const [open, close] = HORARIO[day.getDay()] || HORARIO.default
    const nowMinutes = now.getHours() * 60 + now.getMinutes()
    let start = offset === 0 ? Math.max(open + PREP, nowMinutes + PREP) : open + PREP
    start = Math.ceil(start / 5) * 5
    const last = close - STEP
    if (start > last) continue
    const prefix =
      offset === 0
        ? "Hoy"
        : offset === 1
          ? "Mañana"
          : day.toLocaleDateString("es-MX", { weekday: "long" })
    const times = [start]
    for (let m = Math.ceil((start + 1) / STEP) * STEP; m <= last && times.length < limit; m += STEP)
      times.push(m)
    const slots = times.map((m, index) => ({
      id: `${offset}-${m}`,
      texto: `${prefix}, ${label(m)}`,
      pronto: offset === 0 && index === 0,
    }))
    return slots
  }
  return []
}

export function load(storage) {
  try {
    const saved = JSON.parse(storage?.getItem(STORAGE_KEY) || "null")
    if (!saved || !Array.isArray(saved.cart)) return initialState
    const cart = saved.cart.filter((row) => findItem(row.itemId) && row.cantidad > 0)
    return { ...initialState, ...saved, cart }
  } catch {
    return initialState
  }
}
export function save(storage, state) {
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify(state))
    return true
  } catch {
    return false
  }
}
