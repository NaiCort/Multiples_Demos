// Lotes ficticios de Ladera. Productores, fincas, puntajes y precios son de ejemplo;
// los municipios son reales y solo sitúan el origen de la región cafetalera.

export const LOTES = [
  {
    id: "el-encino",
    nombre: "El Encino",
    productor: "Marisol Cruz Landa",
    finca: "Finca El Encino",
    municipio: "Coatepec",
    altitud: 1380,
    variedad: "Typica y Bourbon",
    proceso: "Lavado",
    notas: ["mandarina", "panela", "cacao"],
    puntaje: 86.5,
    pagadoKg: 168,
    precio250: 240,
    color: "#E3A07A",
    seed: 11,
    semana: true,
  },
  {
    id: "la-joya",
    nombre: "La Joya",
    productor: "Cooperativa Xico Alto",
    finca: "Parcelas La Joya",
    municipio: "Xico",
    altitud: 1520,
    variedad: "Garnica y Caturra",
    proceso: "Honey",
    notas: ["ciruela", "miel de azahar", "té negro"],
    puntaje: 87,
    pagadoKg: 182,
    precio250: 265,
    color: "#6B3A5B",
    seed: 29,
  },
  {
    id: "tres-pasos",
    nombre: "Tres Pasos",
    productor: "Hermanos Ortiz Sampieri",
    finca: "Rancho Tres Pasos",
    municipio: "Teocelo",
    altitud: 1190,
    variedad: "Bourbon",
    proceso: "Natural",
    notas: ["fresa", "chocolate de leche"],
    puntaje: 85.25,
    pagadoKg: 154,
    precio250: 225,
    color: "#C9952F",
    seed: 47,
  },
  {
    id: "cerro-gordo",
    nombre: "Cerro Gordo",
    productor: "Julián Méndez Ruiz",
    finca: "Finca Cerro Gordo",
    municipio: "Huatusco",
    altitud: 1450,
    variedad: "Caturra",
    proceso: "Lavado",
    notas: ["manzana verde", "nuez", "piloncillo"],
    puntaje: 85.75,
    pagadoKg: 160,
    precio250: 235,
    color: "#4E6170",
    seed: 63,
  },
]

export const LOTE_SEMANA = LOTES.find((lote) => lote.semana)

const numero = new Intl.NumberFormat("es-MX")
const decimal = new Intl.NumberFormat("es-MX", { maximumFractionDigits: 2 })
export const metros = (value) => `${numero.format(value)} m`
export const pesos = (value) => `$${numero.format(value)} MXN`
export const puntos = (value) => decimal.format(value)
