// Opciones de cocina ficticias. No todas las recetas admiten los mismos cambios.
const n = (kcal, protein, carbs, fat, fiber = 0, sodium = 0) => ({ kcal, protein, carbs, fat, fiber, sodium })
const coldSize = { id: "size", name: "Tamaño", options: [{ id: "regular", name: "Regular · 400 ml", price: 0, factor: 1 }, { id: "large", name: "Grande · 600 ml", price: 15, factor: 1.5 }] }
const temperature = { id: "temperature", name: "Temperatura", options: [{ id: "hot", name: "Caliente", price: 0 }, { id: "iced", name: "Con hielo", price: 0 }] }
export const PRODUCT_OPTIONS = {
  sopa: [{ id: "size", name: "Porción", options: [{ id: "regular", name: "Tazón · 300 ml", price: 0, factor: 1 }, { id: "large", name: "Tazón grande · 450 ml", price: 35, factor: 1.5 }] }],
  pasta: [{ id: "size", name: "Porción", options: [{ id: "regular", name: "Individual · 350 g", price: 0, factor: 1 }, { id: "large", name: "Para compartir · 525 g", price: 65, factor: 1.5 }] }],
  tacos: [{ id: "size", name: "Porción", options: [{ id: "regular", name: "Tres tacos", price: 0, factor: 1 }, { id: "large", name: "Seis tacos", price: 115, factor: 2 }] }],
  limonada: [coldSize], agua: [coldSize],
  cafe: [{ id: "size", name: "Tamaño", options: [{ id: "regular", name: "Regular · 240 ml", price: 0, factor: 1 }, { id: "large", name: "Grande · 360 ml", price: 12, factor: 1.5 }] }, temperature],
}
export const COMBO = {
  price: 55,
  sides: [
    { id: "sopa", name: "Sopa pequeña de jitomate", image: "sopa", price: 0, nutrients: n(45, 1, 8, 1, 1, 175), animal: "plant", allergens: [] },
    { id: "ensalada", name: "Ensalada pequeña", image: "ensalada", price: 10, nutrients: n(65, 1, 5, 5, 2, 75), animal: "plant", allergens: ["Mostaza"] },
  ],
  drinks: [
    { id: "agua", name: "Jamaica · 250 ml", image: "agua", price: 0, nutrients: n(53, 0, 13, 0), animal: "plant", allergens: [] },
    { id: "limonada", name: "Limonada · 250 ml", image: "limonada", price: 10, nutrients: n(60, 0, 15, 0), animal: "plant", allergens: [] },
  ],
}
export const COMBO_PRODUCTS = ["pasta", "hamburguesa", "pollo", "tacos"]
export function comboParts(config) {
  if (!config.combo) return []
  return [COMBO.sides.find(item => item.id === config.combo.side), COMBO.drinks.find(item => item.id === config.combo.drink)].filter(Boolean)
}
