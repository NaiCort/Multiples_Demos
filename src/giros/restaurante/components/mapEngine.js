import { Map, Marker, NavigationControl, setWorkerUrl } from "maplibre-gl"
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url"
import "maplibre-gl/dist/maplibre-gl.css"
import { coveragePolygon, localLabel, routePosition } from "../data/locations"

setWorkerUrl(workerUrl)
export function createDemoMap(container, { point, route, outside, points = null, onSelectPoint, onReady, onError }) {
  const map = new Map({
    container, style: "https://tiles.openfreemap.org/styles/liberty",
    center: point.coordinates, zoom: route ? 12.5 : 13,
    attributionControl: { compact: true }, cooperativeGestures: true,
    locale: { "NavigationControl.ZoomIn": "Acercar", "NavigationControl.ZoomOut": "Alejar", "NavigationControl.ResetBearing": "Orientar al norte", "AttributionControl.ToggleAttribution": "Mostrar atribución", "CooperativeGesturesHandler.WindowsHelpText": "Usa Ctrl y la rueda para acercar el mapa", "CooperativeGesturesHandler.MacHelpText": "Usa ⌘ y la rueda para acercar el mapa", "CooperativeGesturesHandler.MobileHelpText": "Usa dos dedos para mover el mapa" },
  })
  map.addControl(new NavigationControl({ showCompass: false }), "top-right")
  map.getCanvas().setAttribute("aria-label", points ? "Mapa de referencias de locales simulados. Acerca los grupos para ver cada local." : `Mapa de referencia: ${point.name}. Controles de acercar y alejar disponibles.`)
  const marker = (className, label, coordinates) => {
    const element = document.createElement("span")
    element.className = className
    element.textContent = className.includes("courier") ? "→" : className.includes("destination") ? "B" : "12"
    element.setAttribute("role", "img"); element.setAttribute("aria-label", label)
    return new Marker({ element }).setLngLat(coordinates).addTo(map)
  }
  const localMarkers = []
  let clusters = [], selectedId = point.id
  if (points) points.forEach(item => {
    const element = document.createElement("button")
    element.type = "button"; element.className = "r-map-marker r-local-marker"; element.textContent = "12"
    element.style.display = "none"
    element.setAttribute("aria-label", `Mostrar ${localLabel(item.id)} en el mapa`)
    element.addEventListener("click", () => onSelectPoint?.(item.id))
    new Marker({ element }).setLngLat(item.coordinates).addTo(map)
    localMarkers.push({ id: item.id, element, coordinates: item.coordinates })
  })
  else marker("r-map-marker", "Referencia de un local simulado; no es una sucursal real", point.coordinates)
  let courier
  if (route) { marker("r-map-marker r-map-destination", "Destino ficticio", route.at(-1)); if (!outside) courier = marker("r-map-marker r-map-courier", "Posición simulada, sin GPS", route[0]) }
  const center = group => [0, 1].map(axis => group.reduce((total, item) => total + item.coordinates[axis], 0) / group.length)
  const highlight = () => {
    localMarkers.forEach(item => { item.element.classList.toggle("is-selected", item.id === selectedId); item.element.setAttribute("aria-pressed", String(item.id === selectedId)) })
    clusters.forEach(item => item.element.classList.toggle("is-selected", item.members.some(member => member.id === selectedId)))
  }
  // Agrupar por separación visual evita superponer botones en la vista nacional.
  // Las coordenadas reales de las referencias no se desplazan para separarlos.
  const regroup = () => {
    if (!points) return
    clusters.forEach(item => item.marker.remove()); clusters = []
    localMarkers.forEach(item => { item.element.style.display = "none" })
    const width = container.clientWidth, height = container.clientHeight
    const groups = localMarkers.filter(item => { const p = map.project(item.coordinates); return p.x >= 24 && p.y >= 24 && p.x <= width - 24 && p.y <= height - 24 }).map(item => [item])
    let merged = true
    while (merged) {
      merged = false
      outer: for (let i = 0; i < groups.length; i++) for (let j = i + 1; j < groups.length; j++) {
        const a = map.project(center(groups[i])), b = map.project(center(groups[j]))
        if (Math.abs(a.x - b.x) < 56 && Math.abs(a.y - b.y) < 56) { groups[i].push(...groups.splice(j, 1)[0]); merged = true; break outer }
      }
    }
    groups.forEach(group => {
      if (group.length === 1) { group[0].element.style.display = ""; return }
      const element = document.createElement("button")
      element.type = "button"; element.className = "r-map-marker r-local-cluster"; element.textContent = String(group.length)
      element.setAttribute("aria-label", `Acercar ${group.length} locales simulados: ${group.map(item => localLabel(item.id)).join(", ")}`)
      element.addEventListener("click", () => map.fitBounds([[Math.min(...group.map(item => item.coordinates[0])), Math.min(...group.map(item => item.coordinates[1]))], [Math.max(...group.map(item => item.coordinates[0])), Math.max(...group.map(item => item.coordinates[1]))]], { padding: 65, maxZoom: 14, duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 450 }))
      clusters.push({ element, members: group, marker: new Marker({ element }).setLngLat(center(group)).addTo(map) })
    })
    highlight()
  }
  if (points) map.on("moveend", regroup)
  map.on("load", () => {
    if (!points) {
      map.addSource("coverage", { type: "geojson", data: coveragePolygon(point.coordinates) })
      map.addLayer({ id: "coverage-fill", type: "fill", source: "coverage", paint: { "fill-color": "#41664b", "fill-opacity": 0.08 } })
      map.addLayer({ id: "coverage-line", type: "line", source: "coverage", paint: { "line-color": "#41664b", "line-width": 1.5, "line-dasharray": [3, 3] } })
    }
    if (route && !outside) {
      map.addSource("route", { type: "geojson", data: { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: route } } })
      map.addLayer({ id: "route-outline", type: "line", source: "route", paint: { "line-color": "#fff", "line-width": 8 } })
      map.addLayer({ id: "route-line", type: "line", source: "route", paint: { "line-color": "#203b2e", "line-width": 4, "line-dasharray": [2, 1] } })
    }
    if (route) map.fitBounds([point.coordinates, route.at(-1)], { padding: 65, maxZoom: 14, duration: 0 })
    if (points?.length) map.fitBounds([[Math.min(...points.map(item => item.coordinates[0])), Math.min(...points.map(item => item.coordinates[1]))], [Math.max(...points.map(item => item.coordinates[0])), Math.max(...points.map(item => item.coordinates[1]))]], { padding: 65, maxZoom: 13, duration: 0 })
    regroup()
    // fitBounds solicita otras teselas: esperar a que esa vista termine de cargar.
    map.once("idle", onReady)
  })
  map.on("error", onError)
  const resize = new ResizeObserver(() => map.resize())
  resize.observe(container)
  return {
    progress: fraction => { if (courier && route) courier.setLngLat(routePosition(route, fraction)) },
    select: (id, move = true) => {
      selectedId = id
      const selected = localMarkers.find(item => item.id === id)
      highlight()
      if (selected && move) map.easeTo({ center: selected.coordinates, zoom: 13, duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 450 })
    },
    destroy: () => { resize.disconnect(); map.remove() },
  }
}
