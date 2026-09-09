import { useEffect, useRef, useState } from "react"
import { motion, useReducedMotion, useInView } from "framer-motion"
import { Phone, MapPin, Clock, ChevronRight, ChevronLeft, MessageCircle, ArrowRight, Star } from "lucide-react"
import DemoContactForm from "../../../components/shared/DemoContactForm"
import PrivacyModal from "../../../components/shared/PrivacyModal"
import ComercialCTA from "../../../components/shared/ComercialCTA"
import WhatsAppPreview from "../../../components/shared/WhatsAppPreview"
import ReservationFlow from "../../../components/shared/ReservationFlow"
import Modal from "../../../components/shared/Modal"
import useDemoNavigation from "../../../hooks/useDemoNavigation"
import { withServiceRules } from "../data/services"

const C = {
  white: "#FFFFFF",
  black: "#0A0A0A",
  gray100: "#F5F5F5",
  gray200: "#E8E8E8",
  gray400: "#666666",
  gray600: "#666666",
  accent: "#2D6A4F",
}

function useFonts() {
  useEffect(() => {
    if (document.getElementById("font-minimalista")) return
    const link = document.createElement("link")
    link.id = "font-minimalista"
    link.rel = "stylesheet"
    link.href =
      "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap"
    document.head.appendChild(link)
  }, [])
}

// Línea que se dibuja al entrar en viewport
function DrawLine({ delay = 0 }) {
  const reduced = useReducedMotion()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  return (
    <motion.div
      ref={ref}
      initial={reduced ? false : { scaleX: 0 }}
      animate={reduced || inView ? { scaleX: 1 } : {}}
      transition={reduced ? { duration: 0, delay: 0, repeat: 0 } : { duration: 0.7, delay, ease: "easeInOut" }}
      style={{ originX: 0, height: 1, backgroundColor: C.gray200 }}
      className="w-full"
    />
  )
}

// Fade puro sin movimiento
function FadePure({ children, delay = 0 }) {
  const reduced = useReducedMotion()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div
      ref={ref}
      initial={reduced ? false : { opacity: 0 }}
      animate={reduced || inView ? { opacity: 1 } : {}}
      transition={reduced ? { duration: 0, delay: 0, repeat: 0 } : { duration: 0.7, delay }}
    >
      {children}
    </motion.div>
  )
}

// Texto que aparece letra por letra
function TypeWriter({ text, delay = 0 }) {
  const reduced = useReducedMotion()
  const words = text.split(" ")
  return (
    <span>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduced ? { duration: 0, delay: 0, repeat: 0 } : { duration: 0.4, delay: delay + i * 0.06, ease: "easeOut" }}
          style={{ display: "inline-block", marginRight: "0.25em" }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  )
}

function Navbar() {
  const reduced = useReducedMotion()
  const { scrolled, activeSection, menuOpen, setMenuOpen } = useDemoNavigation()

  const links = [
    { label: "Inicio", href: "#inicio" },
    { label: "Sobre mí", href: "#sobre-mi" },
    { label: "Servicios", href: "#servicios" },
    { label: "Primera cita", href: "#primera-cita" },
    { label: "Contacto", href: "#contacto" },
  ]

  return (
    <motion.nav aria-label="Navegación de la demo"
      className="fixed top-11 left-0 right-0 z-[55]"
      style={{
        backgroundColor: scrolled ? "rgba(255,255,255,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(8px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.gray200}` : "none",
        transition: "all 0.3s ease",
      }}
    >
      <div className="max-w-6xl mx-auto px-8 py-5 flex items-center justify-between">
        <span style={{ fontFamily: "DM Serif Display, serif", color: C.black, fontSize: 18, letterSpacing: "-0.02em" }}>
          Valeria Romero
        </span>

        <div className="hidden xl:flex items-center gap-6">
          {links.map(l => {
            const isActive = activeSection === l.href.slice(1)
            return (
              <a key={l.label} href={l.href} aria-current={activeSection === l.href.slice(1) ? "location" : undefined}
                style={{ color: isActive ? C.black : C.gray600, fontFamily: "DM Sans, sans-serif", fontSize: 13, letterSpacing: "0.04em" }}
                className="hover:opacity-90 transition-opacity uppercase tracking-widest">
                {l.label}
              </a>
            )
          })}
        </div>

        <button className="xl:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}
          aria-haspopup="dialog" aria-expanded={menuOpen} aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}>
          <div className="space-y-1.5">
            <motion.div animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 8 : 0 }}
              className="w-5 h-px" style={{ backgroundColor: C.black }} />
            <motion.div animate={{ opacity: menuOpen ? 0 : 1 }}
              className="w-5 h-px" style={{ backgroundColor: C.black }} />
            <motion.div animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -8 : 0 }}
              className="w-5 h-px" style={{ backgroundColor: C.black }} />
          </div>
        </button>
      </div>

      <>
        {menuOpen && (
          <Modal title="Menú de la demo" onClose={() => setMenuOpen(false)} fontFamily="DM Sans, sans-serif">
          <div className="flex flex-col gap-2">
            {links.map((l, i) => (
              <motion.a
                key={l.label} className="min-h-11 flex items-center" href={l.href} aria-current={activeSection === l.href.slice(1) ? "location" : undefined}
                initial={reduced ? false : { opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={reduced ? { duration: 0, delay: 0, repeat: 0 } : { delay: i * 0.05 }}
                style={{ color: "#ffffff", fontFamily: "DM Serif Display, serif", fontSize: 22 }}
                onClick={() => setMenuOpen(false)}>
                {l.label}
              </motion.a>
            ))}
          </div>
          </Modal>
        )}
      </>
    </motion.nav>
  )
}

function Hero({ onOpenWhatsApp }) {
  const reduced = useReducedMotion()
  return (
    <section id="inicio" className="min-h-screen flex flex-col justify-center pt-[140px] pb-16 px-8"
      style={{ backgroundColor: C.white }}>
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h1 style={{ fontFamily: "DM Serif Display, serif", color: C.black, lineHeight: 1.1, fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
              className="mb-8">
              <TypeWriter text="Terapia psicológica para quien está listo para avanzar." delay={0.2} />
            </h1>

            <motion.p
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={reduced ? { duration: 0, delay: 0, repeat: 0 } : { duration: 0.6, delay: 0.8 }}
              style={{ fontFamily: "DM Sans, sans-serif", color: C.gray600, lineHeight: 1.8, fontSize: 16 }}
              className="mb-10 max-w-md"
            >
              Un espacio de escucha y trabajo genuino. Sin fórmulas genéricas,
              sin promesas vacías. Solo el proceso que tú necesitas.
            </motion.p>

            <motion.div
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={reduced ? { duration: 0, delay: 0, repeat: 0 } : { duration: 0.5, delay: 1 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button onClick={onOpenWhatsApp}
                className="group flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all duration-200"
                style={{ backgroundColor: C.black, color: C.white, fontFamily: "DM Sans, sans-serif", letterSpacing: "0.04em" }}>
                Agendar primera consulta
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <a href="#sobre-mi"
                className="flex items-center gap-2 px-6 py-3 text-sm border transition-all duration-200 hover:bg-gray-50"
                style={{ borderColor: C.gray200, color: C.black, fontFamily: "DM Sans, sans-serif" }}>
                Conocer el enfoque
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={reduced ? { duration: 0, delay: 0, repeat: 0 } : { duration: 0.9, delay: 0.4 }}
            className="relative hidden md:block"
          >
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80"
              alt="Retrato de referencia para el personaje ficticio" fetchPriority="high"
              className="w-full object-cover"
              style={{ height: 560, filter: "grayscale(20%)" }}
            />
            <div className="absolute bottom-6 left-6 right-6 p-4"
              style={{ backgroundColor: "rgba(255,255,255,0.95)", backdropFilter: "blur(8px)" }}>
              <p style={{ fontFamily: "DM Sans, sans-serif", color: C.gray400, fontSize: 11, letterSpacing: "0.08em" }} className="uppercase mb-1">
                Cédula profesional
              </p>
              <p style={{ fontFamily: "DM Serif Display, serif", color: C.black, fontSize: 16 }}>
                12345678 · UNAM · Psicología Clínica
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function Identificacion() {
  const items = [
    { n: "01", title: "Ansiedad persistente", desc: "La preocupación no se detiene aunque no haya razón clara para ello." },
    { n: "02", title: "Relaciones desgastantes", desc: "Patrones que se repiten y que ya no sabes cómo romper." },
    { n: "03", title: "Falta de dirección", desc: "Sensación de estar estancado/a sin saber por dónde empezar." },
  ]

  return (
    <section className="py-24 px-8" style={{ backgroundColor: C.gray100 }}>
      <div className="max-w-6xl mx-auto">
        <FadePure>
          <p style={{ fontFamily: "DM Sans, sans-serif", color: C.gray400, fontSize: 11, letterSpacing: "0.12em" }}
            className="uppercase mb-4">
            ¿Te identificas?
          </p>
          <h2 style={{ fontFamily: "DM Serif Display, serif", color: C.black, fontSize: "clamp(1.8rem, 3vw, 2.5rem)" }}
            className="mb-16 max-w-lg">
            Algunas de las razones por las que las personas llegan aquí
          </h2>
        </FadePure>

        <div className="space-y-0">
          {items.map((item, i) => (
            <FadePure key={i} delay={i * 0.1}>
              <DrawLine delay={i * 0.1} />
              <div className="py-8 grid grid-cols-12 gap-4 items-start">
                <span style={{ fontFamily: "DM Sans, sans-serif", color: C.gray400, fontSize: 12 }}
                  className="col-span-2 md:col-span-1 pt-1">
                  {item.n}
                </span>
                <h3 style={{ fontFamily: "DM Serif Display, serif", color: C.black, fontSize: 20 }}
                  className="col-span-10 md:col-span-4 mb-2 md:mb-0">
                  {item.title}
                </h3>
                <p style={{ fontFamily: "DM Sans, sans-serif", color: C.gray600, lineHeight: 1.7, fontSize: 14 }}
                  className="col-span-12 md:col-span-7">
                  {item.desc}
                </p>
              </div>
            </FadePure>
          ))}
          <DrawLine delay={0.3} />
        </div>
      </div>
    </section>
  )
}

function SobreMi() {
  return (
    <section id="sobre-mi" className="py-24 px-8" style={{ backgroundColor: C.white, scrollMarginTop: 134 }}>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-start">
        <FadePure>
          <h2 style={{ fontFamily: "DM Serif Display, serif", color: C.black, fontSize: "clamp(1.8rem, 3vw, 2.5rem)" }}
            className="mb-8">
            Valeria Romero
          </h2>
            <p className="demo-fiction-note">Perfil ficticio. La formación y la trayectoria son contenido de ejemplo.</p>
          <p style={{ fontFamily: "DM Sans, sans-serif", color: C.gray600, lineHeight: 1.85, fontSize: 15 }}
            className="mb-6">
            Trabajo con personas que enfrentan ansiedad, crisis vitales, dificultades relacionales o simplemente
            sienten que algo no encaja. Mi enfoque es directo, honesto y centrado en lo que realmente importa.
          </p>
          <p style={{ fontFamily: "DM Sans, sans-serif", color: C.gray600, lineHeight: 1.85, fontSize: 15 }}
            className="mb-10">
            Utilizo principalmente terapia cognitivo-conductual y técnicas de tercera generación, adaptadas
            a cada persona y momento.
          </p>

          <div className="space-y-3">
            {[
              "Licenciatura en Psicología, UNAM",
              "Maestría en Psicología Clínica, UNAM",
              "Cédula de ejemplo: 12345678",
              "8 años de práctica clínica",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <ChevronRight size={14} style={{ color: C.accent }} />
                <span style={{ fontFamily: "DM Sans, sans-serif", color: C.gray600, fontSize: 14 }}>{item}</span>
              </div>
            ))}
          </div>
        </FadePure>

        <FadePure delay={0.15}>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&q=80"
              alt="Sala con sillones y plantas, imagen de referencia para esta demo" loading="lazy" decoding="async"
              width={600} height={450}
              className="demo-room-image"
              style={{ filter: "grayscale(10%)" }}
            />
            <div className="grid grid-cols-3 gap-0 mt-0 border-t"
              style={{ borderColor: C.gray200 }}>
              {[
                { n: "3", label: "Servicios" },
                { n: "50 min", label: "Sesión individual" },
                { n: "2", label: "Modalidades" },
              ].map((s, i) => (
                <div key={i} className="py-6 text-center border-r last:border-r-0"
                  style={{ borderColor: C.gray200, backgroundColor: C.gray100 }}>
                  <p style={{ fontFamily: "DM Serif Display, serif", color: C.black, fontSize: 22 }}>{s.n}</p>
                  <p style={{ fontFamily: "DM Sans, sans-serif", color: C.gray400, fontSize: 11, letterSpacing: "0.08em" }}
                    className="uppercase mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </FadePure>
      </div>
    </section>
  )
}

const SERVICIOS_ITEMS = withServiceRules([
  { title: "Terapia Individual", desc: "Trabajamos con lo que realmente te está pasando, sin fórmulas genéricas. Cada sesión tiene un objetivo claro y revisamos juntos si te está funcionando.", duration: "50 min", mode: "Presencial u online" },
  { title: "Terapia de Pareja", desc: "Ambos hablan, yo modero. Identificamos qué se repite en sus conflictos y probamos formas distintas de resolverlos.", duration: "60 min", mode: "Presencial u online" },
  { title: "Orientación Psicológica", desc: "Para algo puntual, no para un proceso largo. Pocas sesiones, un tema concreto, salidas claras.", duration: "45 min", mode: "Online" },
])

function Servicios({ onSelect }) {
  const reduced = useReducedMotion()
  const items = SERVICIOS_ITEMS

  return (
    <section id="servicios" className="py-24 px-8" style={{ backgroundColor: C.gray100, scrollMarginTop: 134 }}>
      <div className="max-w-6xl mx-auto">
        <FadePure>
          <p style={{ fontFamily: "DM Sans, sans-serif", color: C.gray400, fontSize: 11, letterSpacing: "0.12em" }}
            className="uppercase mb-4">
            Servicios
          </p>
          <h2 style={{ fontFamily: "DM Serif Display, serif", color: C.black, fontSize: "clamp(1.8rem, 3vw, 2.5rem)" }}
            className="mb-16">
            ¿En qué puedo ayudarte?
          </h2>
        </FadePure>

        <div className="space-y-0">
          {items.map((item, i) => (
            <FadePure key={i} delay={i * 0.1}>
              <DrawLine />
              <motion.button
                onClick={() => onSelect(item)}
                className="py-8 grid grid-cols-12 gap-4 items-center cursor-pointer group w-full text-left"
                whileHover={{ x: 4 }}
                transition={reduced ? { duration: 0, delay: 0, repeat: 0 } : { duration: 0.2 }}
              >
                <h3 style={{ fontFamily: "DM Serif Display, serif", color: C.black, fontSize: 20 }}
                  className="col-span-12 md:col-span-4">
                  {item.title}
                </h3>
                <p style={{ fontFamily: "DM Sans, sans-serif", color: C.gray600, fontSize: 14, lineHeight: 1.6 }}
                  className="col-span-12 md:col-span-5">
                  {item.desc}
                </p>
                <div className="col-span-12 md:col-span-3 text-right space-y-1">
                  <p style={{ fontFamily: "DM Sans, sans-serif", color: C.gray400, fontSize: 12 }}>
                    <Clock size={11} className="inline mr-1" />{item.duration}
                  </p>
                  <p style={{ fontFamily: "DM Sans, sans-serif", color: C.gray400, fontSize: 12 }}>
                    <MapPin size={11} className="inline mr-1" />{item.mode}
                  </p>
                  <p className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ fontFamily: "DM Sans, sans-serif", color: C.black }}>
                    Reservar →
                  </p>
                </div>
              </motion.button>
            </FadePure>
          ))}
          <DrawLine />
        </div>
      </div>
    </section>
  )
}

function PrimeraCita({ onStartReservation }) {
  const pasos = [
    { n: "01", title: "Contacto", desc: "Me escribes indicando qué te trae por aquí, en tus propias palabras." },
    { n: "02", title: "Agenda", desc: "Coordinamos fecha y horario según tu disponibilidad, presencial o en línea." },
    { n: "03", title: "Primera sesión", desc: "Conversamos con calma, sin presión ni compromisos previos. Solo para conocernos." },
    { n: "04", title: "Tu proceso", desc: "Diseñamos juntos el camino más adecuado para ti y qué esperar de cada sesión." },
  ]

  return (
    <section id="primera-cita" className="py-24 px-8" style={{ backgroundColor: C.white, scrollMarginTop: 134 }}>
      <div className="max-w-6xl mx-auto">
        <FadePure>
          <p style={{ fontFamily: "DM Sans, sans-serif", color: C.gray400, fontSize: 11, letterSpacing: "0.12em" }}
            className="uppercase mb-4">
            Proceso
          </p>
          <h2 style={{ fontFamily: "DM Serif Display, serif", color: C.black, fontSize: "clamp(1.8rem, 3vw, 2.5rem)" }}
            className="mb-16">
            Cómo funciona la primera cita
          </h2>
        </FadePure>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {pasos.map((paso, i) => (
            <FadePure key={i} delay={i * 0.08}>
              <div>
                <p style={{ fontFamily: "DM Sans, sans-serif", color: C.gray200, fontSize: 48, lineHeight: 1, fontWeight: 300 }}
                  className="mb-4">
                  {paso.n}
                </p>
                <h3 style={{ fontFamily: "DM Serif Display, serif", color: C.black, fontSize: 18 }}
                  className="mb-2">
                  {paso.title}
                </h3>
                <p style={{ fontFamily: "DM Sans, sans-serif", color: C.gray600, fontSize: 13, lineHeight: 1.7 }}>
                  {paso.desc}
                </p>
              </div>
            </FadePure>
          ))}
        </div>

        <FadePure delay={0.4}>
          <div className="text-center mt-14">
            <button onClick={onStartReservation}
              className="px-6 py-3 text-sm font-medium transition-all duration-200"
              style={{ backgroundColor: C.black, color: C.white, fontFamily: "DM Sans, sans-serif", letterSpacing: "0.04em" }}>
              Simular una reserva
            </button>
          </div>
        </FadePure>
      </div>
    </section>
  )
}

function Resenas() {
  const reviews = [
    { text: "El proceso fue claro desde el inicio. Sin rodeos, sin tiempo perdido.", author: "Paciente anónimo/a, 34 años", service: "Terapia Individual", date: "Hace 2 meses", rating: 5 },
    { text: "Aprendí a ver mis patrones de una forma completamente distinta.", author: "Paciente anónimo/a, 28 años", service: "Orientación Psicológica", date: "Hace 1 mes", rating: 5 },
    { text: "La comunicación con mi pareja mejoró en pocas sesiones.", author: "Paciente anónimo/a, 41 años", service: "Terapia de Pareja", date: "Hace 3 meses", rating: 4 },
  ]
  const [index, setIndex] = useState(0)
  const current = reviews[index]
  const next = () => setIndex((i) => (i + 1) % reviews.length)
  const prev = () => setIndex((i) => (i - 1 + reviews.length) % reviews.length)

  return (
    <section id="resenas" className="py-24 px-8" style={{ backgroundColor: C.gray100, scrollMarginTop: 134 }}>
      <div className="max-w-2xl mx-auto text-center">
        <FadePure>
          <p style={{ fontFamily: "DM Sans, sans-serif", color: C.gray400, fontSize: 11, letterSpacing: "0.12em" }}
            className="uppercase mb-4">
            Testimonios
          </p>
          <h2 style={{ fontFamily: "DM Serif Display, serif", color: C.black, fontSize: "clamp(1.8rem, 3vw, 2.5rem)" }}
            className="mb-14">
            Quienes ya dieron el paso
          </h2>
            <p className="demo-fiction-note">Reseñas ficticias redactadas para esta demostración.</p>
        </FadePure>

        <div className="flex justify-center gap-0.5 mb-6">
          {[...Array(5)].map((_, s) => (
            <Star key={s} size={14} fill={s < current.rating ? C.black : "none"} style={{ color: C.black }} />
          ))}
        </div>

        <p style={{ fontFamily: "DM Serif Display, serif", color: C.black, lineHeight: 1.6, fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)" }}
          className="mb-8 italic">
          "{current.text}"
        </p>

        <p style={{ fontFamily: "DM Sans, sans-serif", color: C.gray400, fontSize: 12, letterSpacing: "0.04em" }}
          className="mb-1">
          {current.author}
        </p>
        <p style={{ fontFamily: "DM Sans, sans-serif", color: C.gray400, fontSize: 11 }}
          className="mb-10">
          {current.service} · {current.date}
        </p>

        <div className="flex items-center justify-center gap-6">
          <button onClick={prev} aria-label="Reseña anterior"
            className="p-2 hover:opacity-90 transition-opacity">
            <ChevronLeft size={18} style={{ color: C.black }} />
          </button>
          <span style={{ fontFamily: "DM Sans, sans-serif", color: C.gray400, fontSize: 12 }}>
            {index + 1} / {reviews.length}
          </span>
          <button onClick={next} aria-label="Siguiente reseña"
            className="p-2 hover:opacity-90 transition-opacity">
            <ChevronRight size={18} style={{ color: C.black }} />
          </button>
        </div>
      </div>
    </section>
  )
}

function Contacto({ onOpenWhatsApp }) {

  return (
    <section id="contacto" className="py-24 px-8" style={{ backgroundColor: C.black, scrollMarginTop: 134 }}>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20">
        <FadePure>
          <p style={{ fontFamily: "DM Sans, sans-serif", color: "rgba(255,255,255,0.8)", fontSize: 11, letterSpacing: "0.12em" }}
            className="uppercase mb-4">
            Contacto
          </p>
          <h2 style={{ fontFamily: "DM Serif Display, serif", color: C.white, fontSize: "clamp(1.8rem, 3vw, 2.5rem)" }}
            className="mb-8">
            Cuando estés listo/a, aquí estaré.
          </h2>

          <div className="space-y-4 mb-10">
            {[
              { icon: Phone, text: "Número de ejemplo · contacto simulado" },
              { icon: MapPin, text: "Xalapa, Veracruz, México" },
              { icon: Clock, text: "Lunes a Viernes · 9:00 – 19:00" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <item.icon size={15} style={{ color: "rgba(255,255,255,0.8)" }} />
                <span style={{ fontFamily: "DM Sans, sans-serif", color: "rgba(255,255,255,0.6)", fontSize: 14 }}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>

          <button type="button" onClick={onOpenWhatsApp}
            className="group inline-flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all duration-200 hover:opacity-80"
            style={{ backgroundColor: C.white, color: C.black, fontFamily: "DM Sans, sans-serif" }}>
            <MessageCircle size={15} />
            Escribir por WhatsApp
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </FadePure>

        <FadePure delay={0.15}>
          <DemoContactForm accentColor={C.white} fontFamily="DM Sans, sans-serif" variant="minimalista" />
        </FadePure>
      </div>
    </section>
  )
}

function Monogram() {
  return (
    <div className="w-8 h-8 rounded-full border flex items-center justify-center shrink-0"
      style={{ borderColor: "rgba(255,255,255,0.25)" }}>
      <span style={{ fontFamily: "DM Serif Display, serif", color: "rgba(255,255,255,0.8)", fontSize: 12 }}>
        VR
      </span>
    </div>
  )
}

function Footer() {
  const [privacyOpen, setPrivacyOpen] = useState(false)

  return (
    <footer className="pt-8 pb-28 px-8 flex flex-col md:flex-row items-center justify-between gap-4"
      style={{ backgroundColor: C.black, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <p style={{ fontFamily: "DM Sans, sans-serif", color: "rgba(255,255,255,0.8)", fontSize: 12 }}>
        © 2026 Valeria Romero
      </p>

      <Monogram />

      <button onClick={() => setPrivacyOpen(true)}
        className="underline-offset-2 hover:underline transition-all"
        style={{ fontFamily: "DM Sans, sans-serif", color: "rgba(255,255,255,0.8)", fontSize: 11 }}>
        Aviso de privacidad
      </button>

      <PrivacyModal
        isOpen={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
        accentColor={C.white}
        accentTextColor={C.black}
        fontFamily="DM Sans, sans-serif"
        radius={0}
      />
    </footer>
  )
}

export default function ThemeMinimalista() {
  useFonts()
  const [waOpen, setWaOpen] = useState(false)
  const [reservationOpen, setReservationOpen] = useState(false)
  const [preselected, setPreselected] = useState(null)

  const openReservation = (service = null) => {
    setPreselected(service)
    setReservationOpen(true)
  }

  return (
    <div style={{ backgroundColor: C.white }}>
      <Navbar onOpenWhatsApp={() => setWaOpen(true)} />
      <main id="contenido" tabIndex={-1}>
      <Hero onOpenWhatsApp={() => setWaOpen(true)} />
      <Identificacion />
      <SobreMi />
      <Servicios onSelect={openReservation} />
      <PrimeraCita onStartReservation={() => openReservation(null)} />
      <Resenas />
      <ComercialCTA
        accentColor={C.black}
        accentTextColor={C.white}
        backgroundColor="#161616"
        fontFamily="DM Sans, sans-serif"
        headingFontFamily="DM Serif Display, serif"
        radius={0}
        giro="psicólogo (tema Minimalista)"
      />
      <Contacto onOpenWhatsApp={() => setWaOpen(true)} />
      </main>
      <Footer />
      <WhatsAppPreview
        isOpen={waOpen}
        onClose={() => setWaOpen(false)}
        accentColor={C.black}
        fontFamily="DM Sans, sans-serif"
        radius={4}
      />
      <ReservationFlow
        isOpen={reservationOpen}
        onClose={() => setReservationOpen(false)}
        services={SERVICIOS_ITEMS}
        preselectedService={preselected}
        accentColor={C.black}
        fontFamily="DM Sans, sans-serif"
        headingFontFamily="DM Serif Display, serif"
        radius={4}
        accionLabel="consulta"
      />
    </div>
  )
}
