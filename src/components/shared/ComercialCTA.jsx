import { motion, useReducedMotion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { buildWhatsAppUrl } from "./contactInfo"
import { contrastingText, dialogAccent } from "../../utils/colors"

// Llamada comercial real (Parte III, Fase 2 del Documento Maestro): visualmente
// separada de las acciones ficticias del negocio simulado, obligatoria dentro del
// cuerpo de cada demo, distinta de la del banner superior (que es global y fija).
// Copy base tomado de Parte IV, sección 13.

export default function ComercialCTA({
  accentColor,
  backgroundColor,
  textColor = "#ffffff",
  fontFamily,
  headingFontFamily,
  radius = 12,
  giro = "psicólogo",
}) {
  const reduced = useReducedMotion()
  const accent = dialogAccent(accentColor)
  const whatsappUrl = buildWhatsAppUrl(
    `Hola Ian, vi tu demo de ${giro} y me interesa un sitio similar para mi negocio.`
  )

  return (
    <section
      id="trabajemos-juntos"
      className="py-16 px-6"
      style={{ backgroundColor, scrollMarginTop: 140 }}
    >
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={reduced ? { duration: 0, delay: 0, repeat: 0 } : { duration: 0.6 }}
        className="max-w-3xl mx-auto text-center p-8 sm:p-10"
        style={{
          backgroundColor: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: radius,
        }}
      >
        <p
          className="text-xs font-medium uppercase mb-3"
          style={{ color: "#ffffff", fontFamily, letterSpacing: "0.1em" }}
        >
          Sobre esta demo
        </p>
        <h3
          className="mb-4"
          style={{ fontFamily: headingFontFamily || fontFamily, color: textColor, fontSize: "clamp(1.3rem, 2.5vw, 1.7rem)", lineHeight: 1.4 }}
        >
          ¿Te gustaría adaptar una experiencia así a tu negocio?
        </h3>
        <p
          className="mb-7"
          style={{ fontFamily, color: "rgba(255,255,255,0.85)", fontSize: 14.5, lineHeight: 1.7 }}
        >
          Puedo personalizar el estilo, el contenido y los flujos de contacto de un sitio
          como este para tu propio negocio. Este demo es un ejemplo real de lo que puedo construir.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 text-sm font-medium transition-opacity hover:opacity-90"
            style={{ backgroundColor: accent, color: contrastingText(accent), fontFamily, borderRadius: radius > 20 ? 999 : radius }}
          >
            Hablemos
            <ArrowRight size={16} />
          </a>
        </div>
      </motion.div>
    </section>
  )
}
