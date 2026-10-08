import { MENU } from "./menu"

export const MAX_QUANTITY = 9
export const DELIVERY_FEE = 35
export const findProduct = id => MENU.find(product => product.id === id)
export const lineKey = (id, extras = []) => `${id}:${[...extras].sort().join(",")}`
export function unitPrice(line) {
  const product = findProduct(line.productId)
  return product.price + product.extras.filter(extra => line.extras.includes(extra.id)).reduce((sum, extra) => sum + extra.price, 0)
}
export const subtotal = rows => rows.reduce((sum, row) => sum + row.quantity * unitPrice(row), 0)
export function cartReducer(rows, action) {
  if (action.type === "clear") return []
  if (action.type === "remove") return rows.filter(row => row.key !== action.key)
  if (action.type === "quantity") {
    if (!Number.isInteger(action.quantity) || action.quantity < 1 || action.quantity > MAX_QUANTITY) return rows
    return rows.map(row => row.key === action.key ? { ...row, quantity: action.quantity } : row)
  }
  if (action.type === "add") {
    const product = findProduct(action.productId)
    if (!product || !Number.isInteger(action.quantity) || action.quantity < 1 || action.quantity > MAX_QUANTITY) return rows
    const extras = [...new Set(action.extras || [])].filter(id => product.extras.some(extra => extra.id === id)).sort()
    const key = lineKey(product.id, extras)
    const previous = rows.find(row => row.key === key)
    if (previous && previous.quantity + action.quantity > MAX_QUANTITY) return rows
    return previous
      ? rows.map(row => row.key === key ? { ...row, quantity: row.quantity + action.quantity } : row)
      : [...rows, { key, productId: product.id, extras, quantity: action.quantity }]
  }
  return rows
}
