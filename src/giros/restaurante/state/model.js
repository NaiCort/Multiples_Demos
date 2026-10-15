import { cartReducer, findProduct, MODES, subtotal, ZONES } from "../data/order"
import { DEFAULT_POINT, findPoint, pointOrDefault } from "../data/locations"
export const STORAGE_KEY = "patio12-demo-v1"
export const SESSION_TTL = 6 * 60 * 60 * 1000
export const WAIT_MS = 60_000
export const PREP_MS = 30_000
export const initialState = () => ({ pointId: DEFAULT_POINT, visit: null, cart: [], order: null, profile: { member: false, visits: 3, history: [] }, widget: { x: 1, y: 1, compact: false } })
export const uniqueId = prefix => `${prefix}-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`
export function createVisit(mode, people = 2, now = Date.now(), pointId = DEFAULT_POINT, linkedTable = null) {
  const seated = mode === "dine" && Number.isInteger(linkedTable) && linkedTable >= 1 && linkedTable <= 25
  return { id: uniqueId("VISITA"), pointId: pointOrDefault(pointId).id, mode, people, startedAt: now, expiresAt: now + SESSION_TTL, stage: mode === "dine" ? seated ? "seated" : "waiting" : "active", deadline: mode === "dine" && !seated ? now + WAIT_MS : null, candidate: seated ? linkedTable : Math.floor(Math.random() * 25) + 1, table: seated ? linkedTable : null, acknowledged: false, fromQR: seated }
}
export const remainingSeconds = (deadline, now) => deadline ? Math.max(0, Math.ceil((deadline - now) / 1000)) : 0
export const formatClock = seconds => `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`
export function canOrder(state) { return !!state.visit && state.visit.stage !== "waiting" && !state.order }
export function discountRate(profile) { return profile.member ? (profile.visits >= 8 ? 0.1 : 0.05) : 0 }
export function orderQuote(rows, mode, zoneId, profile) {
  const base = subtotal(rows)
  const fee = mode === "delivery" ? (ZONES.find(zone => zone.id === zoneId)?.fee || ZONES[0].fee) : 0
  const discount = Math.round(base * discountRate(profile))
  return { subtotal: base, fee, discount, total: base + fee - discount }
}
function progress(state, now) {
  if (state.visit && now >= state.visit.expiresAt) return { ...state, visit: null, cart: [], order: null }
  let visit = state.visit, order = state.order
  if (visit?.stage === "waiting" && now >= visit.deadline) visit = { ...visit, stage: "seated", table: visit.candidate }
  if (order?.status === "preparing" && now >= order.deadline) {
    order = { ...order, status: order.mode === "delivery" ? "delivering" : "ready", travelStartedAt: order.deadline, deadline: order.mode === "delivery" ? order.arrivalDeadline : null }
  }
  if (order?.status === "delivering" && now >= order.deadline) order = { ...order, status: "delivered", deadline: null }
  return visit === state.visit && order === state.order ? state : { ...state, visit, order }
}
export function restaurantReducer(state, action) {
  if (action.type === "tick") return progress(state, action.now)
  if (action.type === "reset") return initialState()
  if (action.type === "point") {
    if (!findPoint(action.pointId) || state.order && state.order.status !== "completed") return state
    return { ...state, pointId: action.pointId, visit: state.visit ? { ...state.visit, pointId: action.pointId } : null }
  }
  if (action.type === "start") {
    if (state.order && state.order.status !== "completed") return state
    if (!Object.hasOwn(MODES, action.visit?.mode)) return state
    return { ...state, pointId: pointOrDefault(action.visit.pointId).id, visit: action.visit, order: null, widget: { ...state.widget, compact: false } }
  }
  if (action.type === "skip-wait") {
    if (state.visit?.stage !== "waiting") return state
    return { ...state, visit: { ...state.visit, stage: "seated", table: state.visit.candidate } }
  }
  if (action.type === "acknowledge") return { ...state, visit: state.visit ? { ...state.visit, acknowledged: true } : null }
  if (action.type === "cart") {
    if (action.action.type === "add" && !canOrder(state)) return state
    if (state.order) return state
    return { ...state, cart: cartReducer(state.cart, action.action) }
  }
  if (action.type === "member") return { ...state, profile: { ...state.profile, member: !!action.member } }
  if (action.type === "widget") return { ...state, widget: { ...state.widget, ...action.value } }
  if (action.type === "confirm-order") {
    if (!canOrder(state) || !state.cart.length || !/^P12-[A-Z0-9-]+$/.test(action.id)) return state
    const mode = state.visit.mode
    const zone = ZONES.find(zone => zone.id === action.zoneId) || ZONES[0]
    if (mode === "delivery" && (zone.unavailable || typeof action.address !== "string" || action.address.trim().length < 5)) return state
    if (typeof action.name !== "string" || action.name.trim().length < 2 || !Number.isFinite(action.now)) return state
    const quote = orderQuote(state.cart, mode, zone.id, state.profile)
    const order = { id: action.id, visitId: state.visit.id, pointId: state.visit.pointId || state.pointId, rows: state.cart, mode, table: state.visit.table, turn: action.id.slice(-6), createdAt: action.now, status: "preparing", deadline: action.now + PREP_MS, travelStartedAt: action.now + PREP_MS, arrivalDeadline: action.now + PREP_MS + zone.minutes * 1000, zoneId: zone.id, address: mode === "delivery" ? action.address.trim().slice(0, 120) : "", name: action.name.trim().slice(0, 60), payment: action.payment === "digital" ? "digital" : "cash", paid: action.payment === "digital", quote }
    return { ...state, order, cart: [], widget: { ...state.widget, compact: false } }
  }
  if (action.type === "skip-stage" && ["preparing", "delivering"].includes(state.order?.status)) {
    const delivering = state.order.status === "preparing" && state.order.mode === "delivery"
    const deadline = delivering ? action.now + ZONES.find(zone => zone.id === state.order.zoneId).minutes * 1000 : null
    return { ...state, order: { ...state.order, status: delivering ? "delivering" : state.order.status === "preparing" ? "ready" : "delivered", deadline, travelStartedAt: delivering ? action.now : state.order.travelStartedAt, arrivalDeadline: deadline || state.order.arrivalDeadline } }
  }
  if (action.type === "complete") {
    if (!["ready", "delivered"].includes(state.order?.status)) return state
    const order = { ...state.order, status: "completed", paid: true, completedAt: action.now }
    const profile = state.profile.member ? { ...state.profile, visits: state.profile.visits + 1, history: [order, ...state.profile.history].slice(0, 10) } : state.profile
    return { ...state, order, visit: null, cart: [], profile }
  }
  return state
}
function cleanRows(rows) {
  if (!Array.isArray(rows)) return []
  return rows.slice(0, 50).reduce((cart, line) => line && findProduct(line.productId) ? cartReducer(cart, { type: "add", productId: line.productId, quantity: line.quantity, config: line.config }) : cart, [])
}
function cleanOrder(raw) {
  if (!raw || !/^P12-[A-Z0-9-]+$/.test(raw.id) || !Object.hasOwn(MODES, raw.mode) || !["preparing", "delivering", "ready", "delivered", "completed"].includes(raw.status)) return null
  if (!Number.isFinite(raw.createdAt) || !Number.isFinite(raw.arrivalDeadline)) return null
  if (["preparing", "delivering"].includes(raw.status) && !Number.isFinite(raw.deadline)) return null
  const rows = cleanRows(raw.rows)
  if (!rows.length) return null
  const zone = ZONES.find(zone => zone.id === raw.zoneId) || ZONES[0]
  if (raw.mode === "delivery" && zone.unavailable) return null
  const base = subtotal(rows), fee = raw.mode === "delivery" ? zone.fee : 0
  const discount = [0, Math.round(base * 0.05), Math.round(base * 0.1)].includes(raw.quote?.discount) ? raw.quote.discount : 0
  return { ...raw, rows, pointId: pointOrDefault(raw.pointId).id, travelStartedAt: Number.isFinite(raw.travelStartedAt) ? raw.travelStartedAt : raw.arrivalDeadline - zone.minutes * 1000, zoneId: zone.id, address: typeof raw.address === "string" ? raw.address.slice(0, 120) : "", name: typeof raw.name === "string" ? raw.name.slice(0, 60) : "Alex Demo", quote: { subtotal: base, fee, discount, total: base + fee - discount } }
}
export function restoreState(text, now) {
  const state = initialState()
  try {
    const raw = JSON.parse(text)
    if (![1, 2].includes(raw?.schema)) return state
    state.pointId = pointOrDefault(raw.pointId).id
    if (raw.widget) state.widget = { x: Number.isFinite(raw.widget.x) ? Math.max(0, Math.min(1, raw.widget.x)) : 1, y: Number.isFinite(raw.widget.y) ? Math.max(0, Math.min(1, raw.widget.y)) : 1, compact: !!raw.widget.compact }
    if (raw.profile) state.profile = { member: !!raw.profile.member, visits: Number.isInteger(raw.profile.visits) ? Math.max(3, Math.min(10_000, raw.profile.visits)) : 3, history: Array.isArray(raw.profile.history) ? raw.profile.history.map(cleanOrder).filter(order => order?.status === "completed").slice(0, 10) : [] }
    const visit = raw.visit
    if (visit && typeof visit.id === "string" && /^VISITA-[A-Z0-9-]+$/.test(visit.id) && Object.hasOwn(MODES, visit.mode) && ["waiting", "seated", "active"].includes(visit.stage) && Number.isFinite(visit.expiresAt) && visit.expiresAt > now && visit.expiresAt <= now + SESSION_TTL && Number.isInteger(visit.candidate) && visit.candidate >= 1 && visit.candidate <= 25) {
      if (visit.stage === "waiting" && (!Number.isFinite(visit.deadline) || visit.deadline > now + WAIT_MS)) return state
      state.visit = { ...visit, pointId: pointOrDefault(visit.pointId || raw.pointId).id, table: visit.stage === "seated" ? visit.candidate : null }
      state.cart = cleanRows(raw.cart)
      const order = cleanOrder(raw.order)
      state.order = order?.visitId === visit.id && order.status !== "completed" ? order : null
      if (state.order) state.visit.pointId = state.order.pointId
      state.pointId = state.visit.pointId
    }
    return progress(state, now)
  } catch { return state }
}
export function serializeState(state) {
  // Un invitado conserva la sesión activa, pero al terminar deja de persistirse.
  return JSON.stringify({ ...state, schema: 2, order: state.order?.status === "completed" ? null : state.order })
}
