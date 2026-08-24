// Fuente única de los datos de contacto reales de Ian, usados tanto en DemoBanner
// como en el nuevo bloque de llamada comercial dentro del cuerpo de cada demo
// (Parte III, Fase 2, "Llamada comercial real" del Documento Maestro).

export const WHATSAPP_NUMBER = "522281628345"

export function buildWhatsAppUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export const EMAIL_URL = "mailto:ian.martinez2610@gmail.com?subject=" +
  encodeURIComponent("Interesado en un sitio como tu demo") +
  "&body=" + encodeURIComponent("Hola Ian,\n\nVi tu demo y me gustaría platicar sobre un proyecto similar para mi negocio.\n\n")

export const LINKEDIN_URL = "https://www.linkedin.com/in/ian-almarti/"
