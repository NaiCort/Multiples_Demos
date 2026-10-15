import { MENU } from "./menu"
export const MAX_QUANTITY = 9
export const findProduct = id => MENU.find(product => product.id === id)
export const ZONES = [
  { id: "cerca", name: "Cerca del patio · 1 km de ejemplo", distance: 1, minutes: 10, fee: 25, address: "Calle de ejemplo 10 · Zona cercana" },
  { id: "centro", name: "Zona centro · 3 km de ejemplo", distance: 3, minutes: 20, fee: 35, address: "Avenida ficticia 25 · Zona centro" },
  { id: "limite", name: "Límite de cobertura · 5 km de ejemplo", distance: 5, minutes: 30, fee: 45, address: "Camino de muestra 8 · Zona límite" },
]
export const MODES = { dine: "Comer aquí", pickup: "Para llevar", delivery: "A domicilio" }
export const LEVELS = [["normal", "Normal"], ["little", "Menos"], ["apart", "Aparte"], ["none", "Sin este ingrediente"]]
export function cleanConfig(product, config = {}) {
  const extras = [...new Set(Array.isArray(config.extras) ? config.extras : [])].filter(id => product.extras.some(extra => extra.id === id)).sort()
  const amounts = Object.fromEntries(product.ingredients.filter(item => item.adjustable).flatMap(item => {
    const value = config.amounts?.[item.id]
    return ["little", "apart", "none"].includes(value) ? [[item.id, value]] : []
  }))
  const swaps = Object.fromEntries((product.swaps || []).flatMap(group => group.options.some(option => option.id === config.swaps?.[group.id]) ? [[group.id, config.swaps[group.id]]] : []))
  return { extras, amounts, swaps }
}
export function lineKey(id, config = {}) {
  const product = findProduct(id)
  if (!product) return ""
  return `${id}:${JSON.stringify(cleanConfig(product, Array.isArray(config) ? { extras: config } : config))}`
}
export function configuredIngredients(product, config = {}) {
  const clean = cleanConfig(product, config)
  const base = product.ingredients.flatMap(item => {
    const amount = clean.amounts[item.id] || "normal"
    if (amount === "none") return []
    const group = product.swaps?.find(group => group.ingredientId === item.id)
    const swap = group?.options.find(option => option.id === clean.swaps[group.id])
    return [{ ...(swap || item), factor: amount === "little" ? 0.5 : 1 }]
  })
  return [...base, ...product.extras.filter(item => clean.extras.includes(item.id)).map(item => ({ ...item, factor: 1 }))]
}
export function nutrition(product, config = {}) {
  const totals = { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 0 }
  configuredIngredients(product, config).forEach(item => Object.keys(totals).forEach(key => { totals[key] += item.nutrients[key] * item.factor }))
  return Object.fromEntries(Object.entries(totals).map(([key, value]) => [key, Math.round(value)]))
}
export function dietaryTag(product, config = {}) {
  const ingredients = configuredIngredients(product, config)
  if (ingredients.some(item => item.animal === "meat")) return "meat"
  return ingredients.every(item => item.animal === "plant") ? "vegan" : "vegetarian"
}
export const dietLabel = tag => ({ meat: "Con carne", vegan: "Vegano", vegetarian: "Vegetariano" })[tag]
export function allergens(product, config = {}) {
  return [...new Set(configuredIngredients(product, config).flatMap(item => item.allergens || []))].join(", ") || "Sin alérgenos específicos declarados en este ejemplo"
}
export function configSummary(product, config = {}) {
  const clean = cleanConfig(product, config)
  return [
    ...product.ingredients.filter(item => clean.amounts[item.id]).map(item => `${LEVELS.find(([id]) => id === clean.amounts[item.id])[1]}: ${item.name}`),
    ...(product.swaps || []).flatMap(group => group.options.filter(option => option.id === clean.swaps[group.id]).map(option => `${group.name}: ${option.name}`)),
    ...product.extras.filter(item => clean.extras.includes(item.id)).map(item => `Extra: ${item.name}`),
  ]
}
export function unitPrice(line) {
  const product = findProduct(line.productId)
  if (!product) return 0
  const config = cleanConfig(product, line.config || { extras: line.extras })
  return product.price + product.extras.filter(extra => config.extras.includes(extra.id)).reduce((sum, extra) => sum + extra.price, 0)
    + (product.swaps || []).reduce((sum, group) => sum + (group.options.find(option => option.id === config.swaps[group.id])?.price || 0), 0)
}
export const subtotal = rows => rows.reduce((sum, row) => sum + row.quantity * unitPrice(row), 0)
export function cartReducer(rows, action) {
  if (action.type === "clear") return []
  if (action.type === "remove") return rows.filter(row => row.key !== action.key)
  if (action.type === "quantity") {
    if (!Number.isInteger(action.quantity) || action.quantity < 1 || action.quantity > MAX_QUANTITY) return rows
    return rows.map(row => row.key === action.key ? { ...row, quantity: action.quantity } : row)
  }
  if (["add", "edit"].includes(action.type)) {
    const product = findProduct(action.productId)
    if (!product || !Number.isInteger(action.quantity) || action.quantity < 1 || action.quantity > MAX_QUANTITY) return rows
    if (action.type === "edit" && !rows.some(row => row.key === action.key)) return rows
    const config = cleanConfig(product, action.config || { extras: action.extras })
    const key = lineKey(product.id, config)
    const remaining = action.type === "edit" ? rows.filter(row => row.key !== action.key) : rows
    const previous = remaining.find(row => row.key === key)
    if (previous && previous.quantity + action.quantity > MAX_QUANTITY) return rows
    const line = { key, productId: product.id, config, quantity: action.quantity }
    return previous ? remaining.map(row => row.key === key ? { ...line, quantity: row.quantity + action.quantity } : row) : [...remaining, line]
  }
  return rows
}
