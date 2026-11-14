// Carta ficticia de Ladera, ordenada por método de preparación. Precios de ejemplo en MXN.
import { LOTES } from "./lotes"

export const LECHES = [
  { id: "entera", nombre: "Entera", extra: 0 },
  { id: "deslactosada", nombre: "Deslactosada", extra: 0 },
  { id: "avena", nombre: "Avena", extra: 15 },
  { id: "almendra", nombre: "Almendra", extra: 15 },
]
// Alérgenos de ejemplo. La leche se puede cambiar por avena o almendra (almendra = nuez).
export const ALERGENOS = {
  lacteos: "Lácteos",
  gluten: "Gluten",
  huevo: "Huevo",
  nuez: "Nueces",
}
export const AZUCAR = ["Sin azúcar", "Poca", "Normal"]
export const SHOT_EXTRA = 18
export const PESOS = [
  { id: "250", nombre: "250 g", factor: 1 },
  { id: "1000", nombre: "1 kg", factor: 3.6 },
]
export const MOLIENDAS = [
  "Grano entero",
  "Espresso",
  "Moka",
  "Gotero V60",
  "Chemex",
  "Prensa francesa",
]
export const bolsaPrecio = (precio250, peso = "250") =>
  Math.round((precio250 * (PESOS.find((p) => p.id === peso)?.factor || 1)) / 5) * 5

export const CATEGORIAS = [
  {
    id: "espresso",
    nombre: "Espresso",
    nota: "Con el lote de la semana. Doble carga en todas las bebidas.",
    items: [
      {
        id: "espresso",
        alergenos: [],
        nombre: "Espresso",
        desc: "30 ml, servido con agua mineral.",
        precio: 45,
        opciones: ["shots"],
      },
      {
        id: "americano",
        alergenos: [],
        nombre: "Americano",
        desc: "Espresso doble y agua caliente, 240 ml.",
        precio: 52,
        opciones: ["shots", "azucar"],
      },
      {
        id: "cortado",
        alergenos: ["lacteos"],
        nombre: "Cortado",
        desc: "Espresso doble con la misma cantidad de leche texturizada, 120 ml.",
        precio: 58,
        opciones: ["leche", "shots"],
      },
      {
        id: "capuchino",
        alergenos: ["lacteos"],
        nombre: "Capuchino",
        desc: "180 ml, espuma densa.",
        precio: 65,
        opciones: ["leche", "shots", "azucar"],
      },
      {
        id: "latte",
        alergenos: ["lacteos"],
        nombre: "Latte",
        desc: "300 ml, poca espuma.",
        precio: 70,
        opciones: ["leche", "shots", "azucar"],
      },
    ],
  },
  {
    id: "filtrado",
    nombre: "Filtrado",
    nota: "Eliges el lote. Tarda unos cuatro minutos más que el espresso.",
    items: [
      {
        id: "v60",
        alergenos: [],
        nombre: "Gotero V60",
        desc: "Una taza de 300 ml, extracción limpia.",
        precio: 78,
        opciones: ["lote"],
      },
      {
        id: "chemex",
        alergenos: [],
        nombre: "Chemex para dos",
        desc: "600 ml en jarra, dos tazas.",
        precio: 140,
        opciones: ["lote"],
      },
      {
        id: "prensa",
        alergenos: [],
        nombre: "Prensa francesa",
        desc: "350 ml, cuerpo pesado.",
        precio: 72,
        opciones: ["lote"],
      },
    ],
  },
  {
    id: "frios",
    nombre: "Fríos",
    nota: "Preparados al momento con hielo de agua filtrada.",
    items: [
      {
        id: "cold-brew",
        alergenos: [],
        nombre: "Cold brew",
        desc: "Extracción en frío de 16 horas, 350 ml.",
        precio: 68,
        opciones: ["azucar"],
      },
      {
        id: "espresso-tonico",
        alergenos: [],
        nombre: "Espresso tónico",
        desc: "Espresso doble sobre agua tónica y una cáscara de limón, 300 ml.",
        precio: 75,
        opciones: [],
      },
      {
        id: "espresso-naranja",
        alergenos: [],
        nombre: "Espresso con naranja",
        desc: "Jugo de naranja de Álamo, espresso y hielo, 300 ml.",
        precio: 72,
        opciones: [],
      },
    ],
  },
  {
    id: "sin-cafe",
    nombre: "Sin café",
    nota: "Para quien acompaña.",
    items: [
      {
        id: "chocolate",
        alergenos: ["lacteos"],
        nombre: "Chocolate de agua",
        desc: "Tableta de cacao de Tabasco batida a mano, 300 ml.",
        precio: 62,
        opciones: ["leche", "azucar"],
      },
      {
        id: "te-limon",
        alergenos: [],
        nombre: "Té de limón y menta",
        desc: "Infusión de hojas frescas, 350 ml.",
        precio: 45,
        opciones: ["azucar"],
      },
    ],
  },
  {
    id: "pan",
    nombre: "Para acompañar",
    nota: "Del horno de la panadería de la esquina, hasta agotar existencias.",
    items: [
      {
        id: "pan-elote",
        alergenos: ["lacteos", "gluten", "huevo"],
        nombre: "Pan de elote",
        desc: "Rebanada de 110 g, servida tibia.",
        precio: 48,
        opciones: [],
      },
      {
        id: "concha",
        alergenos: ["lacteos", "gluten", "huevo"],
        nombre: "Concha de vainilla",
        desc: "Pieza de 90 g.",
        precio: 32,
        opciones: [],
      },
      {
        id: "panque",
        alergenos: ["lacteos", "gluten", "huevo", "nuez"],
        nombre: "Panqué de plátano y nuez",
        desc: "Rebanada de 120 g.",
        precio: 46,
        opciones: [],
      },
    ],
  },
]

CATEGORIAS.push({
  id: "grano",
  nombre: "Café en grano",
  nota: "Bolsas tostadas esta semana. Las molemos al momento para tu método.",
  items: LOTES.map((lote) => ({
    id: `bolsa-${lote.id}`,
    nombre: `${lote.nombre}, ${lote.municipio}`,
    desc: `${lote.proceso} · ${lote.notas.join(", ")}.`,
    precio: lote.precio250,
    lote: lote.id,
    alergenos: [],
    opciones: ["peso", "molienda"],
  })),
})

export const ITEMS = CATEGORIAS.flatMap((categoria) =>
  categoria.items.map((item) => ({ ...item, categoria: categoria.id })),
)
export const findItem = (id) => ITEMS.find((item) => item.id === id)

// Texto de alérgenos para una línea de la carta o un pedido.
export function alergenosTexto(item, config = {}) {
  const lista = new Set(item.alergenos || [])
  if (config.leche === "avena" || config.leche === "almendra") lista.delete("lacteos")
  if (config.leche === "almendra") lista.add("nuez")
  const texto = [...lista].map((id) => ALERGENOS[id].toLowerCase())
  if (config.leche === "avena" && !lista.has("gluten")) texto.push("posibles trazas de gluten")
  return texto
}
