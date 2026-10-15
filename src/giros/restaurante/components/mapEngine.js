import { Map, Marker, NavigationControl, setWorkerUrl } from "maplibre-gl"
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url"
import "maplibre-gl/dist/maplibre-gl.css"
import { coveragePolygon, routePosition } from "../data/locations"

setWorkerUrl(workerUrl)
export function createDemoMap(container, { point, route, outside, onReady, onError }) {
  const map = new Map({
    container, style: "https://tiles.openfreemap.org/styles/liberty",
    center: point.coordinates, zoom: route ? 12.5 : 13,
    attributionControl: { compact: true }, cooperativeGestures: true,
    locale: { "NavigationControl.ZoomIn": "Acercar", "NavigationControl.ZoomOut": "Alejar", "NavigationControl.ResetBearing": "Orientar al norte", "AttributionControl.ToggleAttribution": "Mostrar atribución", "CooperativeGesturesHandler.WindowsHelpText": "Usa Ctrl y la rueda para acercar el mapa", "CooperativeGesturesHandler.MacHelpText": "Usa ⌘ y la rueda para acercar el mapa", "CooperativeGesturesHandler.MobileHelpText": "Usa dos dedos para mover el mapa" },
  })
  map.addControl(new NavigationControl({ showCompass: false }), "top-right")
  map.getCanvas().setAttribute("aria-label", `Mapa de referencia: ${point.name}. Controles de acercar y alejar disponibles.`)
  const marker = (className, label, coordinates) => {
    const element = document.createElement("span")
    element.className = className
    element.textContent = className.includes("courier") ? "→" : className.includes("destination") ? "B" : "12"
    element.setAttribute("role", "img"); element.setAttribute("aria-label", label)
    return new Marker({ element }).setLngLat(coordinates).addTo(map)
  }
  marker("r-map-marker", "Punto de demostración; no es una sucursal", point.coordinates)
  let courier
  if (route) { marker("r-map-marker r-map-destination", "Destino ficticio", route.at(-1)); if (!outside) courier = marker("r-map-marker r-map-courier", "Posición simulada, sin GPS", route[0]) }
  map.on("load", () => {
    map.addSource("coverage", { type: "geojson", data: coveragePolygon(point.coordinates) })
    map.addLayer({ id: "coverage-fill", type: "fill", source: "coverage", paint: { "fill-color": "#41664b", "fill-opacity": 0.08 } })
    map.addLayer({ id: "coverage-line", type: "line", source: "coverage", paint: { "line-color": "#41664b", "line-width": 1.5, "line-dasharray": [3, 3] } })
    if (route && !outside) {
      map.addSource("route", { type: "geojson", data: { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: route } } })
      map.addLayer({ id: "route-outline", type: "line", source: "route", paint: { "line-color": "#fff", "line-width": 8 } })
      map.addLayer({ id: "route-line", type: "line", source: "route", paint: { "line-color": "#203b2e", "line-width": 4, "line-dasharray": [2, 1] } })
    }
    if (route) map.fitBounds([point.coordinates, route.at(-1)], { padding: 65, maxZoom: 14, duration: 0 })
    onReady()
  })
  map.on("error", onError)
  const resize = new ResizeObserver(() => map.resize())
  resize.observe(container)
  return {
    progress: fraction => { if (courier && route) courier.setLngLat(routePosition(route, fraction)) },
    destroy: () => { resize.disconnect(); map.remove() },
  }
}
