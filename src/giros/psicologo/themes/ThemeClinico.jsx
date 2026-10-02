import { useEffect, useRef, useState } from "react"
import { motion, useReducedMotion, useInView } from "framer-motion"
import { Phone, MapPin, Clock, MessageCircle, CalendarDays, Award, Shield, CheckCircle, Star } from "lucide-react"
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
  bgLight: "#F0F4F8",
  blue: "#2C4A7C",
  blueDark: "#1A2E4A",
  blueLight: "#4A6FA5",
  bluePale: "#EBF0F8",
  gray: "#5A6A7A",
  grayLight: "#5A6A7A",
  accent: "#C17F5A",
}

function useFonts() {
  useEffect(() => {
    if (document.getElementById("font-clinico")) return
    const link = document.createElement("link")
    link.id = "font-clinico"
    link.rel = "stylesheet"
    link.href =
      "https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Source+Sans+3:wght@300;400;500;600&display=swap"
    document.head.appendChild(link)
  }, [])
}

// Slide desde izquierda con fade
function SlideIn({ children, delay = 0 }) {
  const reduced = useReducedMotion()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div
      ref={ref}
      initial={reduced ? false : { opacity: 0, x: -20 }}
      animate={reduced || inView ? { opacity: 1, x: 0 } : {}}
      transition={reduced ? { duration: 0, delay: 0, repeat: 0 } : { duration: 0.55, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}

// Badge de credencial con efecto sello
function CredentialBadge({ text, delay = 0 }) {
  const reduced = useReducedMotion()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  return (
    <motion.div
      ref={ref}
      initial={reduced ? false : { opacity: 0, scale: 0.85 }}
      animate={reduced || inView ? { opacity: 1, scale: 1 } : {}}
      transition={reduced ? { duration: 0, delay: 0, repeat: 0 } : { duration: 0.4, delay, ease: [0.34, 1.56, 0.64, 1] }}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded"
      style={{ backgroundColor: C.bluePale, border: `1px solid ${C.blue}20` }}
    >
      <Shield size={12} style={{ color: C.blue }} />
      <span style={{ fontFamily: "Source Sans 3, sans-serif", color: C.blue, fontSize: 12, fontWeight: 500 }}>
        {text}
      </span>
    </motion.div>
  )
}

function Navbar({ onStartReservation }) {
  const { scrolled, activeSection, menuOpen, setMenuOpen, navigateToSection } = useDemoNavigation()

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
        backgroundColor: scrolled ? "rgba(240,244,248,0.97)" : "rgba(240,244,248,1)",
        backdropFilter: scrolled ? "blur(8px)" : "none",
        borderBottom: `1px solid ${C.blue}15`,
        transition: "all 0.3s ease",
      }}
    >
      {/* Barra superior institucional — solo en escritorio, en móvil el texto envuelve y descuadra el header */}
      <div style={{ backgroundColor: C.blueDark }} className="hidden xl:block py-1.5 px-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <span style={{ fontFamily: "Source Sans 3, sans-serif", color: "rgba(255,255,255,0.6)", fontSize: 11 }}>
            Consulta presencial y en línea · Xalapa, Veracruz
          </span>
          <span style={{ fontFamily: "Source Sans 3, sans-serif", color: "rgba(255,255,255,0.6)", fontSize: 11 }}>
            Cédula de ejemplo: 12345678
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
        <div>
          <span style={{ fontFamily: "Lora, serif", color: C.blueDark, fontSize: 17, fontWeight: 600 }}>
            Valeria Romero
          </span>
          <span style={{ fontFamily: "Source Sans 3, sans-serif", color: C.grayLight, fontSize: 12 }} className="block text-xs">
            Psicóloga Clínica
          </span>
        </div>

        <div className="hidden xl:flex items-center gap-5">
          {links.map(l => {
            const isActive = activeSection === l.href.slice(1)
            return (
              <a key={l.label} href={l.href} onClick={navigateToSection} aria-current={activeSection === l.href.slice(1) ? "location" : undefined}
                style={{ color: isActive ? C.blue : C.gray, fontFamily: "Source Sans 3, sans-serif", fontSize: 14, fontWeight: isActive ? 700 : 400 }}
                className="hover:opacity-90 transition-opacity">
                {l.label}
              </a>
            )
          })}
          <button type="button" onClick={() => { setMenuOpen(false); onStartReservation() }}
            className="min-h-11 px-5 py-2 text-white text-sm font-medium transition-all hover:opacity-90"
            style={{ backgroundColor: C.blue, fontFamily: "Source Sans 3, sans-serif", borderRadius: 4 }}>
            Agendar cita
          </button>
        </div>

        <button type="button" className="demo-icon-button xl:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}
          aria-haspopup="dialog" aria-expanded={menuOpen} aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}>
          <div className="space-y-1.5">
            <motion.div animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 8 : 0 }}
              className="w-6 h-0.5" style={{ backgroundColor: C.blueDark }} />
            <motion.div animate={{ opacity: menuOpen ? 0 : 1 }}
              className="w-6 h-0.5" style={{ backgroundColor: C.blueDark }} />
            <motion.div animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -8 : 0 }}
              className="w-6 h-0.5" style={{ backgroundColor: C.blueDark }} />
          </div>
        </button>
      </div>

      <>
        {menuOpen && (
          <Modal title="Menú de la demo" onClose={() => setMenuOpen(false)} fontFamily="Source Sans 3, sans-serif">
          <div className="flex flex-col gap-2">
            {links.map(l => (
              <a key={l.label} className="min-h-11 flex items-center" href={l.href} aria-current={activeSection === l.href.slice(1) ? "location" : undefined}
                style={{ color: "#ffffff", fontFamily: "Source Sans 3, sans-serif", fontSize: 16 }}
                onClick={navigateToSection}>{l.label}</a>
            ))}
            <button type="button" onClick={() => { setMenuOpen(false); onStartReservation() }}
              className="mt-2 py-3 text-white text-center font-medium"
              style={{ backgroundColor: "#394d43", fontFamily: "Source Sans 3, sans-serif", borderRadius: 4 }}>
              Agendar cita
            </button>
          </div>
          </Modal>
        )}
      </>
    </motion.nav>
  )
}

function Hero({ onStartReservation }) {
  const reduced = useReducedMotion()
  const staggerItems = [
    { delay: 0.1 },
    { delay: 0.25 },
    { delay: 0.4 },
    { delay: 0.55 },
  ]

  return (
    <section id="inicio" className="min-h-screen flex items-center pt-[112px] md:pt-[156px] pb-16 px-8"
      style={{ backgroundColor: C.bgLight }}>
      <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-16 items-center">
        <div>
          <motion.h1
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduced ? { duration: 0, delay: 0, repeat: 0 } : { duration: 0.6, delay: staggerItems[1].delay }}
            style={{ fontFamily: "Lora, serif", color: C.blueDark, lineHeight: 1.25, fontSize: "clamp(2rem, 4vw, 3.2rem)" }}
            className="mb-6"
          >
            Atención psicológica profesional, basada en evidencia
          </motion.h1>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduced ? { duration: 0, delay: 0, repeat: 0 } : { duration: 0.6, delay: staggerItems[2].delay }}
            style={{ fontFamily: "Source Sans 3, sans-serif", color: C.gray, lineHeight: 1.75, fontSize: 15 }}
            className="mb-8 max-w-lg"
          >
            Más de 8 años de práctica clínica acompañando a personas que buscan mejorar
            su salud mental con un enfoque riguroso, ético y centrado en resultados reales.
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduced ? { duration: 0, delay: 0, repeat: 0 } : { duration: 0.5, delay: staggerItems[3].delay }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <button onClick={onStartReservation}
              className="flex items-center justify-center gap-2 px-6 py-3 text-white text-sm font-medium transition-all hover:opacity-90"
              style={{ backgroundColor: C.blue, fontFamily: "Source Sans 3, sans-serif", borderRadius: 4 }}>
              <CalendarDays size={16} aria-hidden="true" />
              Solicitar primera consulta
            </button>
            <a href="#sobre-mi"
              className="flex items-center justify-center gap-2 px-6 py-3 text-sm border transition-all hover:bg-white"
              style={{ borderColor: C.blue, color: C.blue, fontFamily: "Source Sans 3, sans-serif", borderRadius: 4 }}>
              Ver formación y credenciales
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={reduced ? { duration: 0, delay: 0, repeat: 0 } : { duration: 0.8, delay: 0.3 }}
          className="hidden md:block"
        >
          <div style={{ position: "relative" }}>
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80"
              alt="Retrato de referencia para el personaje ficticio" fetchPriority="high"
              className="w-full object-cover"
              style={{ height: 500, borderRadius: 4 }}
            />
            {/* Tarjeta de credencial superpuesta */}
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduced ? { duration: 0, delay: 0, repeat: 0 } : { duration: 0.5, delay: 0.7 }}
              className="absolute bottom-6 left-6 right-6 p-5"
              style={{
                backgroundColor: C.white,
                borderLeft: `4px solid ${C.blue}`,
                boxShadow: "0 4px 24px rgba(44,74,124,0.15)"
              }}
            >
              <div className="flex items-start gap-3">
                <Award size={20} style={{ color: C.blue, marginTop: 2 }} />
                <div>
                  <p style={{ fontFamily: "Lora, serif", color: C.blueDark, fontSize: 15, fontWeight: 600 }}>
                    Valeria Romero
                  </p>
                  <p style={{ fontFamily: "Source Sans 3, sans-serif", color: C.gray, fontSize: 12, marginTop: 2 }}>
                    Maestra en Psicología Clínica · UNAM
                  </p>
                  <p style={{ fontFamily: "Source Sans 3, sans-serif", color: C.grayLight, fontSize: 11, marginTop: 1 }}>
                    Cédula de ejemplo: 12345678
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Identificacion() {
  const reduced = useReducedMotion()
  const items = [
    { title: "Trastornos de ansiedad", desc: "Ansiedad generalizada, crisis de pánico, fobias y estrés crónico con impacto en la vida diaria." },
    { title: "Estado de ánimo", desc: "Depresión, distimia, duelo complicado y dificultades en la regulación emocional." },
    { title: "Problemática relacional", desc: "Dificultades de comunicación, conflictos de pareja y patrones interpersonales disfuncionales." },
  ]

  return (
    <section className="py-20 px-8" style={{ backgroundColor: C.white }}>
      <div className="max-w-6xl mx-auto">
        <SlideIn>
          <h2 style={{ fontFamily: "Lora, serif", color: C.blueDark, fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}
            className="mb-3">
            Áreas de atención
          </h2>
          <p style={{ fontFamily: "Source Sans 3, sans-serif", color: C.grayLight, fontSize: 14 }}
            className="mb-12">
            Especialización en las siguientes problemáticas clínicas
          </p>
        </SlideIn>

        <div className="grid md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <SlideIn key={i} delay={i * 0.1}>
              <motion.div
                className="p-6 border-l-2 cursor-default"
                style={{ borderColor: C.blue, backgroundColor: C.bgLight }}
                whileHover={reduced ? undefined : { borderColor: C.accent, x: 3 }}
                transition={reduced ? { duration: 0, delay: 0, repeat: 0 } : { duration: 0.2 }}
              >
                <h3 style={{ fontFamily: "Lora, serif", color: C.blueDark, fontSize: 17 }}
                  className="mb-3">
                  {item.title}
                </h3>
                <p style={{ fontFamily: "Source Sans 3, sans-serif", color: C.gray, fontSize: 13, lineHeight: 1.65 }}>
                  {item.desc}
                </p>
              </motion.div>
            </SlideIn>
          ))}
        </div>
      </div>
    </section>
  )
}

function SobreMi() {
  return (
    <section id="sobre-mi" className="py-20 px-8" style={{ backgroundColor: C.bgLight, scrollMarginTop: 164 }}>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
        <div>
          <SlideIn>
            <h2 style={{ fontFamily: "Lora, serif", color: C.blueDark, fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}
              className="mb-6">
              Formación y experiencia
            </h2>
            <p className="demo-fiction-note">Perfil ficticio. La formación y la trayectoria son contenido de ejemplo.</p>
          </SlideIn>

          <SlideIn delay={0.1}>
            <p style={{ fontFamily: "Source Sans 3, sans-serif", color: C.gray, lineHeight: 1.8, fontSize: 14 }}
              className="mb-6">
              Cuento con formación de posgrado en psicología clínica y más de 8 años de práctica
              profesional en atención a adultos. Mi trabajo está fundamentado en terapia
              cognitivo-conductual, integrando técnicas humanistas y adaptando
              el acompañamiento a cada proceso.
            </p>
          </SlideIn>

          <SlideIn delay={0.2}>
            <div className="space-y-3 mb-6">
              {[
                "Licenciatura en Psicología, UNAM",
                "Maestría en Psicología Clínica, UNAM",
                "Especialidad en Terapia Cognitivo-Conductual",
                "Cédula de ejemplo: 12345678",

              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle size={15} style={{ color: C.blue, marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontFamily: "Source Sans 3, sans-serif", color: C.gray, fontSize: 13 }}>{item}</span>
                </div>
              ))}
            </div>
          </SlideIn>

          <SlideIn delay={0.25}>
            <div className="flex flex-wrap gap-2 mb-8">
              {["Atención individualizada", "Modalidad presencial y online", "Evaluación clínica inicial"].map((tag, i) => (
                <CredentialBadge key={i} text={tag} delay={0.1 + i * 0.1} />
              ))}
            </div>
          </SlideIn>

          <SlideIn delay={0.3}>
            <div className="grid grid-cols-3 gap-3">
              {[
                { n: "3", label: "Servicios" },
                { n: "50 min", label: "Sesión individual" },
                { n: "2", label: "Modalidades" },
              ].map((s, i) => (
                <div key={i} className="p-4 text-center"
                  style={{ backgroundColor: C.white, border: `1px solid ${C.blue}15` }}>
                  <p style={{ fontFamily: "Lora, serif", color: C.blue, fontSize: 22 }}>{s.n}</p>
                  <p style={{ fontFamily: "Source Sans 3, sans-serif", color: C.grayLight, fontSize: 11 }}
                    className="mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </SlideIn>
        </div>

        <SlideIn delay={0.15}>
          <img
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&q=80"
            alt="Sala con sillones y plantas, imagen de referencia para esta demo" loading="lazy" decoding="async"
            width={600} height={450}
            className="demo-room-image"
            style={{ borderRadius: 4 }}
          />
        </SlideIn>
      </div>
    </section>
  )
}

const SERVICIOS_ITEMS = withServiceRules([
  { title: "Psicoterapia Individual", desc: "Empezamos con una conversación para entender qué te trae a consulta y qué te gustaría que cambiara. A partir de ahí trabajamos con herramientas con respaldo científico, revisando cada cierto tiempo qué tanto has avanzado hacia lo que buscabas.", duration: "50 min / sesión", mode: "Presencial u online" },
  { title: "Terapia de Pareja", desc: "Ambos comparten, con mi acompañamiento, qué está pasando en la relación desde su propia perspectiva. Identificamos los patrones que generan los conflictos repetidos y practicamos, en sesión, formas distintas de comunicarse.", duration: "60 min / sesión", mode: "Presencial u online" },
  { title: "Consulta de Orientación", desc: "Si tienes una situación específica que resolver, no hace falta iniciar un proceso largo. Evaluamos juntos qué está pasando y sales de la sesión con recomendaciones concretas sobre cómo continuar.", duration: "45 min / sesión", mode: "Online" },
])

function Servicios({ onSelect }) {
  const reduced = useReducedMotion()
  const items = SERVICIOS_ITEMS

  return (
    <section id="servicios" className="py-20 px-8" style={{ backgroundColor: C.white, scrollMarginTop: 164 }}>
      <div className="max-w-6xl mx-auto">
        <SlideIn>
          <h2 style={{ fontFamily: "Lora, serif", color: C.blueDark, fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}
            className="mb-12">
            Servicios clínicos
          </h2>
        </SlideIn>

        <div className="grid md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <SlideIn key={i} delay={i * 0.1}>
              <motion.button
                onClick={() => onSelect(item)}
                className="p-6 h-full flex flex-col text-left w-full cursor-pointer"
                style={{ backgroundColor: C.bgLight, border: `1px solid ${C.blue}10` }}
                whileHover={reduced ? undefined : { boxShadow: `0 8px 32px ${C.blue}15`, y: -2 }}
                transition={reduced ? { duration: 0, delay: 0, repeat: 0 } : { duration: 0.2 }}
              >
                <h3 style={{ fontFamily: "Lora, serif", color: C.blueDark, fontSize: 17 }}
                  className="mb-3">
                  {item.title}
                </h3>
                <p style={{ fontFamily: "Source Sans 3, sans-serif", color: C.gray, fontSize: 13, lineHeight: 1.65 }}
                  className="flex-1 mb-4">
                  {item.desc}
                </p>
                <div className="pt-4 space-y-1.5"
                  style={{ borderTop: `1px solid ${C.blue}12` }}>
                  <div className="flex items-center gap-2">
                    <Clock size={12} style={{ color: C.blueLight }} />
                    <span style={{ fontFamily: "Source Sans 3, sans-serif", color: C.grayLight, fontSize: 12 }}>
                      {item.duration}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={12} style={{ color: C.blueLight }} />
                    <span style={{ fontFamily: "Source Sans 3, sans-serif", color: C.grayLight, fontSize: 12 }}>
                      {item.mode}
                    </span>
                  </div>
                </div>
                <span className="mt-4 text-xs font-semibold" style={{ fontFamily: "Source Sans 3, sans-serif", color: C.blue }}>
                  Reservar este servicio →
                </span>
              </motion.button>
            </SlideIn>
          ))}
        </div>
      </div>
    </section>
  )
}

function PrimeraCita({ onStartReservation }) {
  const pasos = [
    { n: "01", title: "Contacto inicial", desc: "Envía un mensaje contándome, en tus palabras, qué te gustaría trabajar. No necesitas usar términos técnicos ni tener claro un diagnóstico." },
    { n: "02", title: "Primera conversación", desc: "Nos reunimos para que me cuentes tu situación con calma. Esta primera sesión no te compromete a continuar el proceso." },
    { n: "03", title: "Acordamos el plan", desc: "Definimos juntos, en términos simples, qué vamos a trabajar y cómo, para que sepas exactamente qué esperar de las siguientes sesiones." },
    { n: "04", title: "Inicio del proceso", desc: "Comenzamos con sesiones regulares. Cada cierto tiempo revisamos juntos qué tanto has avanzado hacia lo que buscabas." },
  ]

  return (
    <section id="primera-cita" className="py-20 px-8" style={{ backgroundColor: C.bgLight, scrollMarginTop: 164 }}>
      <div className="max-w-6xl mx-auto">
        <SlideIn>
          <h2 style={{ fontFamily: "Lora, serif", color: C.blueDark, fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}
            className="mb-12">
            Proceso de atención
          </h2>
        </SlideIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pasos.map((paso, i) => (
            <SlideIn key={i} delay={i * 0.1}>
              <div className="p-5" style={{ backgroundColor: C.white, borderTop: `3px solid ${C.blue}` }}>
                <p style={{ fontFamily: "Source Sans 3, sans-serif", color: C.grayLight, fontSize: 11, letterSpacing: "0.08em" }}
                  className="mb-3 uppercase">
                  Paso {paso.n}
                </p>
                <h3 style={{ fontFamily: "Lora, serif", color: C.blueDark, fontSize: 16 }}
                  className="mb-2">
                  {paso.title}
                </h3>
                <p style={{ fontFamily: "Source Sans 3, sans-serif", color: C.gray, fontSize: 13, lineHeight: 1.6 }}>
                  {paso.desc}
                </p>
              </div>
            </SlideIn>
          ))}
        </div>

        <SlideIn delay={0.4}>
          <div className="text-center mt-12">
            <button onClick={onStartReservation}
              className="px-6 py-3 text-white text-sm font-medium transition-all hover:opacity-90"
              style={{ backgroundColor: C.blue, fontFamily: "Source Sans 3, sans-serif", borderRadius: 4 }}>
              Simular una reserva
            </button>
          </div>
        </SlideIn>
      </div>
    </section>
  )
}

function Resenas() {
  const reviews = [
    { text: "El enfoque profesional y estructurado me dio claridad desde las primeras sesiones.", author: "Paciente anónimo/a, 38 años", service: "Psicoterapia Individual", date: "Hace 2 meses", rating: 5 },
    { text: "Sentí respaldo profesional real. Cada sesión tenía un propósito claro.", author: "Paciente anónimo/a, 31 años", service: "Consulta de Orientación", date: "Hace 6 semanas", rating: 5 },
    { text: "La seriedad y el rigor del proceso me generaron mucha confianza.", author: "Paciente anónimo/a, 45 años", service: "Terapia de Pareja", date: "Hace 4 meses", rating: 4 },
  ]

  return (
    <section id="resenas" className="py-20 px-8" style={{ backgroundColor: C.white, scrollMarginTop: 164 }}>
      <div className="max-w-4xl mx-auto">
        <SlideIn>
          <h2 style={{ fontFamily: "Lora, serif", color: C.blueDark, fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}
            className="mb-12">
            Testimonios de pacientes
          </h2>
            <p className="demo-fiction-note">Reseñas ficticias redactadas para esta demostración.</p>
        </SlideIn>

        <div style={{ borderTop: `1px solid ${C.blue}20` }}>
          {reviews.map((r, i) => (
            <SlideIn key={i} delay={i * 0.1}>
              <div className="py-6" style={{ borderBottom: `1px solid ${C.blue}20` }}>
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} size={13} fill={s < r.rating ? C.blue : "none"} style={{ color: C.blue }} />
                    ))}
                  </div>
                  <span style={{ fontFamily: "Source Sans 3, sans-serif", color: C.blueDark, fontSize: 12, fontWeight: 600 }}>
                    {r.service}
                  </span>
                  <span style={{ fontFamily: "Source Sans 3, sans-serif", color: C.grayLight, fontSize: 11 }}>
                    · {r.date}
                  </span>
                </div>
                <p style={{ fontFamily: "Lora, serif", color: C.gray, lineHeight: 1.7, fontSize: 14 }}
                  className="mb-3 italic">
                  "{r.text}"
                </p>
                <p style={{ fontFamily: "Source Sans 3, sans-serif", color: C.grayLight, fontSize: 12 }}>
                  {r.author}
                </p>
              </div>
            </SlideIn>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contacto({ onOpenWhatsApp }) {

  return (
    <section id="contacto" className="py-20 px-8" style={{ backgroundColor: C.blueDark, scrollMarginTop: 164 }}>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
        <SlideIn>
          <h2 style={{ fontFamily: "Lora, serif", color: C.white, fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}
            className="mb-6">
            Solicitar consulta
          </h2>
          <p style={{ fontFamily: "Source Sans 3, sans-serif", color: "rgba(255,255,255,0.65)", lineHeight: 1.75, fontSize: 14 }}
            className="mb-8">
            Para agendar una primera evaluación, puede contactarme directamente
            por WhatsApp o completar el formulario de contacto.
          </p>

          <div className="space-y-4 mb-8">
            {[
              { icon: Phone, text: "Número de ejemplo · contacto simulado" },
              { icon: MapPin, text: "Xalapa, Veracruz, México" },
              { icon: Clock, text: "Lunes a Viernes · 9:00 – 19:00" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <item.icon size={15} style={{ color: "rgba(255,255,255,0.8)" }} />
                <span style={{ fontFamily: "Source Sans 3, sans-serif", color: "rgba(255,255,255,0.65)", fontSize: 13 }}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>

          <button type="button" onClick={onOpenWhatsApp}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all hover:opacity-90"
            style={{ backgroundColor: C.white, color: C.blueDark, fontFamily: "Source Sans 3, sans-serif", borderRadius: 4 }}>
            <MessageCircle size={15} />
            Contactar por WhatsApp
          </button>
        </SlideIn>

        <SlideIn delay={0.15}>
          <DemoContactForm accentColor={C.blueLight} fontFamily="Source Sans 3, sans-serif" variant="clinico" />
        </SlideIn>
      </div>
    </section>
  )
}

function Footer() {
  const [privacyOpen, setPrivacyOpen] = useState(false)

  return (
    <footer className="pt-8 pb-28 px-8 flex flex-col md:flex-row items-center justify-between gap-2"
      style={{ backgroundColor: "#111B2A", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <p style={{ fontFamily: "Source Sans 3, sans-serif", color: "rgba(255,255,255,0.8)", fontSize: 12 }}>
        © 2026 Valeria Romero · Psicóloga Clínica · Cédula de ejemplo 12345678
      </p>
      <p style={{ fontFamily: "Source Sans 3, sans-serif", fontSize: 11 }}>
        <button onClick={() => setPrivacyOpen(true)}
          className="min-h-11 px-2 underline-offset-2 hover:underline transition-all"
          style={{ color: "rgba(255,255,255,0.8)", fontFamily: "Source Sans 3, sans-serif" }}>
          Aviso de privacidad
        </button>
        <span style={{ color: "rgba(255,255,255,0.8)" }}> · Espacio de escucha</span>
      </p>

      <PrivacyModal
        isOpen={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
        accentColor={C.blueLight}
        fontFamily="Source Sans 3, sans-serif"
        radius={4}
      />
    </footer>
  )
}

export default function ThemeClinico() {
  useFonts()
  const [waOpen, setWaOpen] = useState(false)
  const [reservationOpen, setReservationOpen] = useState(false)
  const [preselected, setPreselected] = useState(null)

  const openReservation = (service = null) => {
    setPreselected(service)
    setReservationOpen(true)
  }

  return (
    <div style={{ backgroundColor: C.bgLight }}>
      <Navbar onStartReservation={() => openReservation(null)} />
      <main id="contenido" tabIndex={-1}>
      <Hero onStartReservation={() => openReservation(null)} />
      <Identificacion />
      <SobreMi />
      <Servicios onSelect={openReservation} />
      <PrimeraCita onStartReservation={() => openReservation(null)} />
      <Resenas />
      <ComercialCTA
        accentColor={C.blue}
        backgroundColor={C.blueDark}
        fontFamily="Source Sans 3, sans-serif"
        headingFontFamily="Lora, serif"
        radius={4}
        giro="psicólogo (tema Clínico)"
      />
      <Contacto onOpenWhatsApp={() => setWaOpen(true)} />
      </main>
      <Footer />
      <WhatsAppPreview
        isOpen={waOpen}
        onClose={() => setWaOpen(false)}
        accentColor={C.blue}
        fontFamily="Source Sans 3, sans-serif"
        radius={4}
      />
      <ReservationFlow
        isOpen={reservationOpen}
        onClose={() => setReservationOpen(false)}
        services={SERVICIOS_ITEMS}
        preselectedService={preselected}
        accentColor={C.blue}
        fontFamily="Source Sans 3, sans-serif"
        headingFontFamily="Lora, serif"
        radius={4}
        accionLabel="consulta"
      />
    </div>
  )
}
