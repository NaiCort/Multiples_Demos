// Guías de preparación en casa. Las cantidades son para la porción base y se escalan
// con el número de tazas; `agua` en cada paso es el total acumulado en la jarra (gramos)
// y `{agua}` en el texto se sustituye por esa cantidad ya escalada.

export const GUIAS = [
  {
    id: "v60",
    nombre: "Gotero V60",
    molienda: "Gotero V60",
    descripcion: "Una taza limpia y aromática. Necesitas un gotero, filtro de papel y báscula.",
    tazas: { base: 1, max: 2 },
    cafe: 15,
    agua: 250,
    temperatura: 93,
    grano: "Media fina, como sal de mesa",
    pasos: [
      { at: 0, agua: 45, texto: "Moja el café con {agua} g de agua y deja que suelte el gas." },
      { at: 45, agua: 150, texto: "Vierte en círculos lentos desde el centro." },
      { at: 75, agua: 250, texto: "Completa el agua sin tocar las paredes del filtro." },
      { at: 105, agua: 250, texto: "Deja que drene. Gira el gotero una vez para nivelar." },
    ],
    fin: 180,
  },
  {
    id: "chemex",
    nombre: "Chemex",
    molienda: "Chemex",
    descripcion: "Para compartir. El filtro grueso da una taza muy clara, con menos cuerpo.",
    tazas: { base: 2, max: 3 },
    cafe: 30,
    agua: 500,
    temperatura: 94,
    grano: "Media gruesa, como azúcar morena",
    pasos: [
      { at: 0, agua: 60, texto: "Moja el café con {agua} g de agua y espera." },
      { at: 45, agua: 250, texto: "Vierte en espiral hasta la mitad del agua." },
      { at: 90, agua: 500, texto: "Completa el agua en dos o tres vertidos." },
      { at: 150, agua: 500, texto: "Deja que drene. Retira el filtro al terminar." },
    ],
    fin: 270,
  },
  {
    id: "prensa",
    nombre: "Prensa francesa",
    molienda: "Prensa francesa",
    descripcion: "La más sencilla. Cuerpo pesado; no necesitas filtro de papel.",
    tazas: { base: 1, max: 3 },
    cafe: 20,
    agua: 300,
    temperatura: 95,
    grano: "Gruesa, como sal de grano",
    pasos: [
      { at: 0, agua: 300, texto: "Vierte toda el agua de una vez y tapa sin presionar." },
      { at: 240, agua: 300, texto: "Rompe la capa de arriba con una cuchara y retira la espuma." },
      { at: 270, agua: 300, texto: "Presiona el émbolo despacio, sin forzar." },
    ],
    fin: 300,
  },
  {
    id: "moka",
    nombre: "Moka",
    molienda: "Moka",
    descripcion: "Café intenso en estufa. Las cantidades dependen del tamaño de tu cafetera.",
    tazas: { base: 1, max: 1 },
    cafe: 15,
    agua: 150,
    temperatura: null,
    grano: "Fina, pero no tanto como para espresso",
    pasos: [
      {
        at: 0,
        agua: 150,
        texto: "Agua caliente hasta la válvula, café sin compactar, fuego medio.",
      },
      { at: 150, agua: 150, texto: "Cuando empiece a salir, baja el fuego al mínimo." },
      { at: 210, agua: 150, texto: "Al oír el burbujeo, retira del fuego y enfría la base." },
    ],
    fin: 240,
  },
]

export const findGuia = (id) => GUIAS.find((guia) => guia.id === id)
