// Reglas compartidas; cada tema conserva su redacción y composición.
export const SERVICE_RULES = [
  { id: "individual", title: "Terapia Individual", duration: "50 min / sesión", modalities: ["Presencial", "Online"] },
  { id: "pareja", title: "Terapia de Pareja", duration: "60 min / sesión", modalities: ["Presencial", "Online"] },
  { id: "orientacion", title: "Orientación Psicológica", duration: "45 min / sesión", modalities: ["Online"] },
]

export function withServiceRules(items) {
  return items.map((item, index) => ({
    ...item, ...SERVICE_RULES[index],
    mode: SERVICE_RULES[index].modalities.length === 2 ? "Presencial u online" : "Online",
  }))
}
