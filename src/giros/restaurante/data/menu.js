export const CATEGORIES = ["Todo", "Entradas", "Platos", "Postres", "Bebidas"]
export const MENU = [
  { id: "ensalada", name: "Ensalada del patio", category: "Entradas", price: 125, description: "Hojas verdes, jitomate, pepino y vinagreta de limón. Fresca, sin complicaciones.", allergens: "Mostaza en la vinagreta", tag: "Vegetariano", photo: "ensalada", extras: [{ id: "aguacate", name: "Aguacate", price: 25 }] },
  { id: "queso", name: "Queso al horno", category: "Entradas", price: 145, description: "Queso fundido, champiñones y pan de la casa para compartir.", allergens: "Leche y trigo", extras: [] },
  { id: "sopa", name: "Sopa de jitomate", category: "Entradas", price: 95, description: "Jitomate rostizado, albahaca y un toque de crema. Se sirve con pan.", allergens: "Leche y trigo", tag: "Vegetariano", extras: [] },
  { id: "pasta", name: "Pasta de la casa", category: "Platos", price: 195, description: "Pasta con pesto de albahaca, parmesano y jitomates. El pan va por nuestra cuenta.", allergens: "Trigo, leche y nueces", tag: "Favorito de la casa", photo: "pasta", extras: [{ id: "hongos", name: "Champiñones salteados", price: 30 }, { id: "pollo", name: "Pollo a la plancha", price: 45 }] },
  { id: "hamburguesa", name: "Hamburguesa Patio", category: "Platos", price: 215, description: "Res a la plancha, queso, lechuga y cebolla caramelizada. Acompañada de papas.", allergens: "Trigo, leche, huevo y mostaza", photo: "hamburguesa", extras: [{ id: "queso", name: "Queso extra", price: 20 }, { id: "tocino", name: "Tocino", price: 30 }] },
  { id: "pollo", name: "Pollo al limón", category: "Platos", price: 225, description: "Pechuga a la plancha, verduras de temporada y arroz con limón.", allergens: "Preparado en una cocina que maneja los alérgenos indicados en la carta", extras: [] },
  { id: "tacos", name: "Tacos de hongos", category: "Platos", price: 165, description: "Tres tortillas de maíz con hongos, cebolla y salsa verde aparte.", allergens: "Preparado en una cocina que maneja los alérgenos indicados en la carta", tag: "Vegetariano", extras: [{ id: "aguacate", name: "Aguacate", price: 25 }] },
  { id: "flan", name: "Flan de vainilla", category: "Postres", price: 75, description: "Una porción de flan con caramelo. El final que no necesita explicación.", allergens: "Leche y huevo", extras: [] },
  { id: "pastel", name: "Pastel de chocolate", category: "Postres", price: 95, description: "Bizcocho de chocolate con ganache. Se sirve a temperatura ambiente.", allergens: "Trigo, leche y huevo", extras: [] },
  { id: "limonada", name: "Limonada de la casa", category: "Bebidas", price: 55, description: "Limón recién exprimido y agua mineral, en vaso de 400 ml.", allergens: "Sin alérgenos específicos declarados en este ejemplo", extras: [] },
  { id: "agua", name: "Agua de jamaica", category: "Bebidas", price: 45, description: "Infusión de jamaica con un poco de azúcar, en vaso de 400 ml.", allergens: "Sin alérgenos específicos declarados en este ejemplo", extras: [] },
  { id: "cafe", name: "Café americano", category: "Bebidas", price: 45, description: "Café de filtro, recién hecho. Taza de 240 ml.", allergens: "Sin alérgenos específicos declarados en este ejemplo", extras: [] },
]
export const FEATURED = ["pasta", "hamburguesa", "ensalada"].map(id => MENU.find(item => item.id === id))
export const money = value => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(value)
export const normalizeSearch = value => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()
