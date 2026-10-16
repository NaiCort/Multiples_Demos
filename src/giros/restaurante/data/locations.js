// Referencias geográficas aproximadas de OpenStreetMap; nunca son sucursales.
export const COUNTRIES = [{ id: "mx", name: "México" }, { id: "us", name: "Estados Unidos" }]
export const STATES = [
  ["cdmx", "Ciudad de México", "mx"], ["baja-california", "Baja California", "mx"],
  ["chiapas", "Chiapas", "mx"], ["guanajuato", "Guanajuato", "mx"], ["jalisco", "Jalisco", "mx"],
  ["nuevo-leon", "Nuevo León", "mx"], ["oaxaca", "Oaxaca", "mx"], ["puebla", "Puebla", "mx"],
  ["queretaro", "Querétaro", "mx"], ["veracruz", "Veracruz", "mx"], ["yucatan", "Yucatán", "mx"],
  ["california", "California", "us"], ["texas", "Texas", "us"],
].map(([id, name, countryCode]) => ({ id, name, countryCode }))
const area = {
  xalapa: ["veracruz", "Centro"], chapultepec: ["cdmx", "Chapultepec"], alameda: ["cdmx", "Alameda"],
  puebla: ["puebla", "Centro"], merida: ["yucatan", "Centro"], guadalajara: ["jalisco", "Agua Azul"],
  monterrey: ["nuevo-leon", "Fundidora"], tijuana: ["baja-california", "Morelos"],
  oaxaca: ["oaxaca", "El Llano"], chiapas: ["chiapas", "Centro"], queretaro: ["queretaro", "Alameda"],
  guanajuato: ["guanajuato", "Centro"], austin: ["texas", "Zilker"], "san-antonio": ["texas", "Brackenridge"],
  "los-angeles": ["california", "Griffith"], "san-francisco": ["california", "Golden Gate"],
}
export const POINTS = [
  { id: "xalapa", city: "Xalapa, Veracruz", name: "Parque Juárez", coordinates: [-96.9237455, 19.5265862], timeZone: "America/Mexico_City", osm: "way/691364227" },
  { id: "chapultepec", city: "Ciudad de México", name: "Bosque de Chapultepec", coordinates: [-99.1881929, 19.4218002], timeZone: "America/Mexico_City", osm: "node/9041879851" },
  { id: "alameda", city: "Ciudad de México", name: "Alameda Central", coordinates: [-99.1439908, 19.4357156], timeZone: "America/Mexico_City", osm: "way/4758957" },
  { id: "puebla", city: "Puebla, Puebla", name: "Zócalo de Puebla", coordinates: [-98.1981095, 19.0436856], timeZone: "America/Mexico_City", osm: "way/528509571" },
  { id: "merida", city: "Mérida, Yucatán", name: "Plaza Grande", coordinates: [-89.6237445, 20.9670748], timeZone: "America/Merida", osm: "way/1296783856" },
  { id: "guadalajara", city: "Guadalajara, Jalisco", name: "Parque Agua Azul", coordinates: [-103.3481931, 20.6598678], timeZone: "America/Mexico_City", osm: "relation/13589817" },
  { id: "monterrey", city: "Monterrey, Nuevo León", name: "Parque Fundidora", coordinates: [-100.282186, 25.6771028], timeZone: "America/Monterrey", osm: "way/30987006" },
  { id: "tijuana", city: "Tijuana, Baja California", name: "Parque Morelos", coordinates: [-116.9387316, 32.4989374], timeZone: "America/Tijuana", osm: "way/161454528" },
  { id: "oaxaca", city: "Oaxaca de Juárez, Oaxaca", name: "Paseo Juárez · El Llano", coordinates: [-96.7196055, 17.0682301], timeZone: "America/Mexico_City", osm: "way/30050283" },
  { id: "chiapas", city: "San Cristóbal de las Casas, Chiapas", name: "Plaza 31 de Marzo", coordinates: [-92.6376098, 16.7370301], timeZone: "America/Mexico_City", osm: "way/1363465371" },
  { id: "queretaro", city: "Santiago de Querétaro, Querétaro", name: "Alameda Hidalgo", coordinates: [-100.3878955, 20.5879178], timeZone: "America/Mexico_City", osm: "relation/4122123" },
  { id: "guanajuato", city: "Guanajuato, Guanajuato", name: "Jardín de la Unión", coordinates: [-101.2528499, 21.0159353], timeZone: "America/Mexico_City", osm: "way/27356583" },
  { id: "austin", city: "Austin, Texas", name: "Zilker Metropolitan Park", coordinates: [-97.7735775, 30.2694065], timeZone: "America/Chicago", osm: "relation/13307353" },
  { id: "san-antonio", city: "San Antonio, Texas", name: "Brackenridge Park", coordinates: [-98.4748283, 29.4554497], timeZone: "America/Chicago", osm: "way/132057360" },
  { id: "los-angeles", city: "Los Angeles, California", name: "Griffith Park", coordinates: [-118.3050915, 34.1344267], timeZone: "America/Los_Angeles", osm: "relation/7091174" },
  { id: "san-francisco", city: "San Francisco, California", name: "Golden Gate Park", coordinates: [-122.4821837, 37.7693681], timeZone: "America/Los_Angeles", osm: "way/158602261" },
].map(point => {
  const [stateId, localName] = area[point.id]
  const state = STATES.find(item => item.id === stateId)
  return { ...point, localName, stateId, state: state.name, countryCode: state.countryCode, country: COUNTRIES.find(item => item.id === state.countryCode).name, cityLabel: point.city === "Ciudad de México" ? "CDMX" : point.city.split(",")[0] }
})
export const pointsInArea = ({ country = "", state = "", city = "" } = {}) => POINTS.filter(point => (!country || point.countryCode === country) && (!state || point.stateId === state) && (!city || point.city === city))
export function locationFilters(params) {
  const country = COUNTRIES.some(item => item.id === params.get("pais")) ? params.get("pais") : ""
  const state = STATES.find(item => item.id === params.get("estado") && (!country || item.countryCode === country))
  const area = { country: country || state?.countryCode || "", state: state?.id || "" }
  const city = pointsInArea(area).some(point => point.city === params.get("ciudad")) ? params.get("ciudad") : ""
  return { ...area, city }
}
export const DEFAULT_POINT = "chapultepec"
export const LEGACY_POINT = "xalapa"
export const findPoint = id => POINTS.find(point => point.id === id)
export const pointOrDefault = id => findPoint(id) || findPoint(DEFAULT_POINT)
export const localLabel = id => { const point = pointOrDefault(id); return `${point.cityLabel} · ${point.localName}` }
export function distanceKm(a, b) {
  const rad = value => value * Math.PI / 180
  const dlat = rad(b[1] - a[1]), dlon = rad(b[0] - a[0])
  const h = Math.sin(dlat / 2) ** 2 + Math.cos(rad(a[1])) * Math.cos(rad(b[1])) * Math.sin(dlon / 2) ** 2
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - Math.min(1, h)))
}
export function nearestPoint(coordinates) {
  return POINTS.map(point => ({ point, distance: distanceKm(coordinates, point.coordinates) })).sort((a, b) => a.distance - b.distance)[0]
}
// Trazos ilustrativos preparados, no indicaciones viales ni rutas calculadas.
export function exampleRoute(pointId, zone) {
  const point = pointOrDefault(pointId)
  const [lng, lat] = point.coordinates
  const km = zone.distance
  const x = km / (111.32 * Math.cos(lat * Math.PI / 180)), y = km / 111.32
  return [[lng, lat], [lng + x * 0.20, lat], [lng + x * 0.20, lat + y * 0.30], [lng + x * 0.45, lat + y * 0.30], [lng + x * 0.45, lat + y * 0.55]]
}
export function routePosition(route, fraction) {
  const distances = route.slice(1).map((point, index) => distanceKm(route[index], point))
  let remaining = distances.reduce((a, b) => a + b, 0) * Math.max(0, Math.min(1, fraction))
  for (let i = 0; i < distances.length; i++) {
    if (remaining <= distances[i]) { const t = distances[i] ? remaining / distances[i] : 0; return route[i].map((value, axis) => value + (route[i + 1][axis] - value) * t) }
    remaining -= distances[i]
  }
  return route.at(-1)
}
export function coveragePolygon(coordinates, radius = 5) {
  const [lng, lat] = coordinates
  const ring = Array.from({ length: 65 }, (_, index) => { const angle = index / 64 * Math.PI * 2; return [lng + radius * Math.cos(angle) / (111.32 * Math.cos(lat * Math.PI / 180)), lat + radius * Math.sin(angle) / 111.32] })
  return { type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: [ring] } }
}
export function pointTime(pointId, now = Date.now()) {
  return new Intl.DateTimeFormat("es-MX", { timeZone: pointOrDefault(pointId).timeZone, hour: "2-digit", minute: "2-digit", hour12: false }).format(now)
}
export function entryLink(pointId, table = null, origin = window.location.origin) {
  const url = new URL("/restaurante", origin)
  url.searchParams.set("punto", pointOrDefault(pointId).id)
  if (Number.isInteger(table) && table >= 1 && table <= 25) url.searchParams.set("mesa", table)
  return url.href
}
export function parseEntry(params) {
  if (!params.has("punto") && !params.has("mesa")) return null
  const point = findPoint(params.get("punto"))
  const rawTable = params.get("mesa")
  const table = rawTable === null ? null : /^([1-9]|1[0-9]|2[0-5])$/.test(rawTable) ? Number(rawTable) : NaN
  return { point, table, valid: !!point && (table === null || Number.isInteger(table)) }
}
