import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import useFavicon from "../hooks/useFavicon"
import usePageMetadata from "../hooks/usePageMetadata"
import useRouteFocus from "../hooks/useRouteFocus"

// Pantalla de bienvenida (Fase 3 del Documento Maestro): puerta de entrada al
// sistema completo de demos. No es un giro — es la identidad propia de Ian como
// portafolio. El selector de temas, la marca de agua y el banner de demo NO
// viven aquí; son exclusivos de cada demo individual (ver PsicologoApp.jsx).
//
// Dirección visual: un "directorio" (como el tablero de una recepción), no una
// cuadrícula de tarjetas con íconos — evita el patrón por default de "elige tu
// plan". El acento latón/dorado evoca una placa grabada, distinto del combo
// crema+terracota y del negro+verde-ácido documentados como genéricos en la
// Parte IV, sección 15 del Documento Maestro.

const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&family=IBM+Plex+Sans:wght@300;400;500&family=IBM+Plex+Mono:wght@400;500&display=swap"

function useFonts() {
  useEffect(() => {
    if (document.getElementById("font-bienvenida")) return
    const link = document.createElement("link")
    link.id = "font-bienvenida"
    link.rel = "stylesheet"
    link.href = FONT_URL
    document.head.appendChild(link)
  }, [])
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Buenos días"
  if (hour < 19) return "Buenas tardes"
  return "Buenas noches"
}

const GIROS = [
  { path: "/psicologo", name: "Psicólogo", desc: "Consultas, citas y un primer acercamiento sin fricción.", available: true },
  { path: "/restaurante", name: "Restaurante", desc: "Patio 12: carta, pedido y reserva de mesa simulados.", available: true },
  { path: null, name: "Café", desc: "Calidez, ritmo pausado, y motivo suficiente para quedarse un rato.", available: false },
  { path: null, name: "Gimnasio", desc: "Energía, comunidad, y una razón real para inscribirse.", available: false },
  { path: null, name: "Taller mecánico", desc: "Confianza técnica, mostrada, no solo prometida.", available: false },
  { path: null, name: "Despacho contable", desc: "Orden, claridad, y cifras que inspiran confianza.", available: false },
  { path: null, name: "Revista digital", desc: "Una identidad editorial completa, no solo un blog.", available: false },
]

function AmbientBackground() {
  const reduced = useReducedMotion()
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <motion.div
        className="absolute rounded-full"
        style={{ width: 560, height: 560, top: "-10%", left: "-8%", background: "radial-gradient(circle, rgba(201,162,39,0.14) 0%, transparent 70%)" }}
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={reduced ? { duration: 0, delay: 0, repeat: 0 } : { repeat: Infinity, duration: 26, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{ width: 480, height: 480, bottom: "-12%", right: "-6%", background: "radial-gradient(circle, rgba(201,162,39,0.09) 0%, transparent 70%)" }}
        animate={{ x: [0, -30, 0], y: [0, -24, 0] }}
        transition={reduced ? { duration: 0, delay: 0, repeat: 0 } : { repeat: Infinity, duration: 32, ease: "easeInOut", delay: 2 }}
      />
    </div>
  )
}

export default function Bienvenida() {
  const reduced = useReducedMotion()
  useFonts()
  useFavicon("/favicon.svg")
  useRouteFocus()
  usePageMetadata("Ian Aldana Martínez — Portafolio de demos interactivas", "Catálogo de prototipos interactivos por tipo de negocio, hechos por Ian Aldana Martínez.")
  const [greeting] = useState(getGreeting)

  const C = {
    bg: "#0F1418",
    panel: "#171E24",
    gold: "#C9A227",
    text: "#EDE8DE",
    muted: "#8B939A",
    line: "rgba(237,232,222,0.1)",
  }

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ backgroundColor: C.bg }}>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <AmbientBackground />

      <main id="contenido" tabIndex={-1} className="relative z-10 max-w-2xl mx-auto px-6 py-20 sm:py-28">
        <motion.p
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={reduced ? { duration: 0, delay: 0, repeat: 0 } : { duration: 0.6 }}
          className="text-xs uppercase mb-4"
          style={{ fontFamily: "IBM Plex Mono, monospace", color: C.gold, letterSpacing: "0.14em" }}
        >
          Portafolio interactivo
        </motion.p>

        <motion.h1
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduced ? { duration: 0, delay: 0, repeat: 0 } : { duration: 0.7, delay: 0.1 }}
          style={{ fontFamily: "Newsreader, serif", color: C.text, fontSize: "clamp(2.2rem, 5vw, 3.2rem)", lineHeight: 1.15 }}
          className="mb-4"
        >
          {greeting}. Soy <em style={{ fontStyle: "italic", color: C.gold }}>Ian</em>.
        </motion.h1>

        <motion.p
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduced ? { duration: 0, delay: 0, repeat: 0 } : { duration: 0.6, delay: 0.2 }}
          style={{ fontFamily: "IBM Plex Sans, sans-serif", color: C.muted, fontSize: 15, lineHeight: 1.7 }}
          className="mb-16 max-w-md"
        >
          Este es un catálogo de prototipos interactivos de alta fidelidad, cada uno
          pensado para un tipo de negocio distinto. Elige un giro para ver la demo completa.
        </motion.p>

        <div style={{ borderTop: `1px solid ${C.line}` }}>
          {GIROS.map((giro, i) => {
            const RowInner = (
              <>
                <div className="flex items-center gap-5 flex-1 min-w-0">
                  <span
                    className="text-xs shrink-0"
                    style={{ fontFamily: "IBM Plex Mono, monospace", color: giro.available ? C.gold : C.muted }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <p
                      style={{
                        fontFamily: "Newsreader, serif",
                        color: giro.available ? C.text : C.muted,
                        fontSize: 20,
                      }}
                    >
                      {giro.name}
                    </p>
                    <p
                      className="mt-0.5 truncate sm:whitespace-normal"
                      style={{ fontFamily: "IBM Plex Sans, sans-serif", color: C.muted, fontSize: 12.5, opacity: 1 }}
                    >
                      {giro.desc}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-4">
                  {giro.available ? (
                    <>
                      <span className="hidden sm:inline text-xs" style={{ fontFamily: "IBM Plex Mono, monospace", color: C.gold }}>
                        Disponible
                      </span>
                      <ArrowUpRight size={16} style={{ color: C.gold }} />
                    </>
                  ) : (
                    <span
                      className="text-[10px] uppercase px-2 py-1"
                      style={{ fontFamily: "IBM Plex Mono, monospace", color: C.muted, border: `1px solid ${C.line}`, letterSpacing: "0.08em" }}
                    >
                      Próximamente
                    </span>
                  )}
                </div>
              </>
            )

            const rowStyle = { borderBottom: `1px solid ${C.line}` }

            return (
              <motion.div
                key={giro.name}
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduced ? { duration: 0, delay: 0, repeat: 0 } : { duration: 0.5, delay: 0.3 + i * 0.06 }}
              >
                {giro.available ? (
                  <Link
                    to={giro.path}
                    className="group flex items-center justify-between py-5 transition-colors duration-200"
                    style={rowStyle}
                  >
                    {RowInner}
                  </Link>
                ) : (
                  <div className="flex items-center justify-between py-5 cursor-default" style={rowStyle}>
                    {RowInner}
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>

        <motion.p
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={reduced ? { duration: 0, delay: 0, repeat: 0 } : { duration: 0.6, delay: 0.9 }}
          className="mt-10 text-xs"
          style={{ fontFamily: "IBM Plex Mono, monospace", color: C.muted }}
        >
          Xalapa, Veracruz, México · ian.martinez2610@gmail.com
        </motion.p>
      </main>
    </div>
  )
}
