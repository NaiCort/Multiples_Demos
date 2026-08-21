import { useEffect, useRef, useState } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Phone, MapPin, Clock, MessageCircle, Award, Shield, CheckCircle, Star } from "lucide-react"
import useContactForm from "../hooks/useContactForm"
import DemoConfirmation from "../components/shared/DemoConfirmation"
import PrivacyModal from "../components/shared/PrivacyModal"

const C = {
  white: "#FFFFFF",
  bgLight: "#F0F4F8",
  blue: "#2C4A7C",
  blueDark: "#1A2E4A",
  blueLight: "#4A6FA5",
  bluePale: "#EBF0F8",
  gray: "#5A6A7A",
  grayLight: "#8A9AAA",
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
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}

// Badge de credencial con efecto sello
function CredentialBadge({ text, delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.4, delay, ease: [0.34, 1.56, 0.64, 1] }}
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

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const links = [
    { label: "Inicio", href: "#" },
    { label: "Sobre mí", href: "#sobre-mi" },
    { label: "Servicios", href: "#servicios" },
    { label: "Primera cita", href: "#primera-cita" },
    { label: "Contacto", href: "#contacto" },
  ]

  return (
    <motion.nav
      className="fixed top-11 left-0 right-0 z-[55]"
      style={{
        backgroundColor: scrolled ? "rgba(240,244,248,0.97)" : "rgba(240,244,248,1)",
        backdropFilter: scrolled ? "blur(8px)" : "none",
        borderBottom: `1px solid ${C.blue}15`,
        transition: "all 0.3s ease",
      }}
    >
      {/* Barra superior institucional — solo en escritorio, en móvil el texto envuelve y descuadra el header */}
      <div style={{ backgroundColor: C.blueDark }} className="hidden md:block py-1.5 px-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <span style={{ fontFamily: "Source Sans 3, sans-serif", color: "rgba(255,255,255,0.6)", fontSize: 11 }}>
            Consulta presencial y en línea · Xalapa, Veracruz
          </span>
          <span style={{ fontFamily: "Source Sans 3, sans-serif", color: "rgba(255,255,255,0.6)", fontSize: 11 }}>
            Cédula profesional: 12345678
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
        <div>
          <span style={{ fontFamily: "Lora, serif", color: C.blueDark, fontSize: 17, fontWeight: 600 }}>
            Dra. Valeria Romero
          </span>
          <span style={{ fontFamily: "Source Sans 3, sans-serif", color: C.grayLight, fontSize: 12, marginLeft: 8 }}>
            Psicóloga Clínica
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <a key={l.label} href={l.href}
              style={{ color: C.gray, fontFamily: "Source Sans 3, sans-serif", fontSize: 14 }}
              className="hover:opacity-60 transition-opacity">
              {l.label}
            </a>
          ))}
          <a href="https://wa.me/521234567890?text=Hola, me gustaría agendar una cita"
            target="_blank" rel="noopener noreferrer"
            className="px-5 py-2 text-white text-sm font-medium transition-all hover:opacity-90"
            style={{ backgroundColor: C.blue, fontFamily: "Source Sans 3, sans-serif", borderRadius: 4 }}>
            Agendar cita
          </a>
        </div>

        <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
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

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="md:hidden absolute top-full left-0 right-0 py-6 px-8 flex flex-col gap-4"
            style={{ backgroundColor: C.bgLight, borderBottom: `1px solid ${C.blue}15`, minHeight: "100dvh" }}
          >
            {links.map(l => (
              <a key={l.label} href={l.href}
                style={{ color: C.gray, fontFamily: "Source Sans 3, sans-serif", fontSize: 16 }}
                onClick={() => setMenuOpen(false)}>{l.label}</a>
            ))}
            <a href="https://wa.me/521234567890"
              className="mt-2 py-3 text-white text-center font-medium"
              style={{ backgroundColor: C.blue, fontFamily: "Source Sans 3, sans-serif", borderRadius: 4 }}>
              Agendar cita
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

function Hero() {
  const staggerItems = [
    { delay: 0.1 },
    { delay: 0.25 },
    { delay: 0.4 },
    { delay: 0.55 },
  ]

  return (
    <section className="min-h-screen flex items-center pt-[112px] md:pt-[156px] pb-16 px-8"
      style={{ backgroundColor: C.bgLight }}>
      <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-16 items-center">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: staggerItems[1].delay }}
            style={{ fontFamily: "Lora, serif", color: C.blueDark, lineHeight: 1.25, fontSize: "clamp(2rem, 4vw, 3.2rem)" }}
            className="mb-6"
          >
            Atención psicológica profesional, basada en evidencia
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: staggerItems[2].delay }}
            style={{ fontFamily: "Source Sans 3, sans-serif", color: C.gray, lineHeight: 1.75, fontSize: 15 }}
            className="mb-8 max-w-lg"
          >
            Más de 8 años de práctica clínica acompañando a personas que buscan mejorar
            su salud mental con un enfoque riguroso, ético y centrado en resultados reales.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: staggerItems[3].delay }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <a href="https://wa.me/521234567890?text=Hola, me gustaría agendar una cita"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3 text-white text-sm font-medium transition-all hover:opacity-90"
              style={{ backgroundColor: C.blue, fontFamily: "Source Sans 3, sans-serif", borderRadius: 4 }}>
              <MessageCircle size={16} />
              Solicitar primera consulta
            </a>
            <a href="#sobre-mi"
              className="flex items-center justify-center gap-2 px-6 py-3 text-sm border transition-all hover:bg-white"
              style={{ borderColor: C.blue, color: C.blue, fontFamily: "Source Sans 3, sans-serif", borderRadius: 4 }}>
              Ver formación y credenciales
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="hidden md:block"
        >
          <div style={{ position: "relative" }}>
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80"
              alt="Psicóloga"
              className="w-full object-cover"
              style={{ height: 500, borderRadius: 4 }}
            />
            {/* Tarjeta de credencial superpuesta */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
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
                    Dra. Valeria Romero
                  </p>
                  <p style={{ fontFamily: "Source Sans 3, sans-serif", color: C.gray, fontSize: 12, marginTop: 2 }}>
                    Maestra en Psicología Clínica · UNAM
                  </p>
                  <p style={{ fontFamily: "Source Sans 3, sans-serif", color: C.grayLight, fontSize: 11, marginTop: 1 }}>
                    Cédula profesional: 12345678
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
                whileHover={{ borderColor: C.accent, x: 3 }}
                transition={{ duration: 0.2 }}
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
          </SlideIn>

          <SlideIn delay={0.1}>
            <p style={{ fontFamily: "Source Sans 3, sans-serif", color: C.gray, lineHeight: 1.8, fontSize: 14 }}
              className="mb-6">
              Cuento con formación de posgrado en psicología clínica y más de 8 años de práctica
              profesional en atención a adultos. Mi trabajo está fundamentado en terapia
              cognitivo-conductual de tercera generación, con especial énfasis en ACT y terapia
              basada en evidencia.
            </p>
          </SlideIn>

          <SlideIn delay={0.2}>
            <div className="space-y-3 mb-6">
              {[
                "Licenciatura en Psicología, UNAM",
                "Maestría en Psicología Clínica, UNAM",
                "Especialidad en Terapia Cognitivo-Conductual",
                "Cédula profesional: 12345678",
                "Miembro activo de la Sociedad Mexicana de Psicología",
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
              {["Sesiones 100% confidenciales", "Modalidad presencial y online", "Evaluación clínica inicial"].map((tag, i) => (
                <CredentialBadge key={i} text={tag} delay={0.1 + i * 0.1} />
              ))}
            </div>
          </SlideIn>

          <SlideIn delay={0.3}>
            <div className="grid grid-cols-3 gap-3">
              {[
                { n: "412", label: "Pacientes atendidos" },
                { n: "8+", label: "Años de práctica" },
                { n: "94%", label: "Satisfacción" },
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
            src="https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=600&q=80"
            alt="Consultorio"
            className="w-full object-cover"
            style={{ height: 460, borderRadius: 4 }}
          />
        </SlideIn>
      </div>
    </section>
  )
}

function Servicios() {
  const items = [
    { title: "Psicoterapia Individual", desc: "Empezamos con una conversación para entender qué te trae a consulta y qué te gustaría que cambiara. A partir de ahí trabajamos con herramientas con respaldo científico, revisando cada cierto tiempo qué tanto has avanzado hacia lo que buscabas.", duration: "50 min / sesión", mode: "Presencial u online" },
    { title: "Terapia de Pareja", desc: "Ambos comparten, con mi acompañamiento, qué está pasando en la relación desde su propia perspectiva. Identificamos los patrones que generan los conflictos repetidos y practicamos, en sesión, formas distintas de comunicarse.", duration: "60 min / sesión", mode: "Presencial u online" },
    { title: "Consulta de Orientación", desc: "Si tienes una situación específica que resolver, no hace falta iniciar un proceso largo. Evaluamos juntos qué está pasando y sales de la sesión con recomendaciones concretas sobre cómo continuar.", duration: "45 min / sesión", mode: "Online" },
  ]

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
              <motion.div
                className="p-6 h-full flex flex-col"
                style={{ backgroundColor: C.bgLight, border: `1px solid ${C.blue}10` }}
                whileHover={{ boxShadow: `0 8px 32px ${C.blue}15`, y: -2 }}
                transition={{ duration: 0.2 }}
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
              </motion.div>
            </SlideIn>
          ))}
        </div>
      </div>
    </section>
  )
}

function PrimeraCita() {
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

function Contacto() {
  const nombreRef = useRef(null)
  const form = useContactForm({ nombreRef })

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
              { icon: Phone, text: "+52 (123) 456-7890" },
              { icon: MapPin, text: "Xalapa, Veracruz, México" },
              { icon: Clock, text: "Lunes a Viernes · 9:00 – 19:00" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <item.icon size={15} style={{ color: "rgba(255,255,255,0.4)" }} />
                <span style={{ fontFamily: "Source Sans 3, sans-serif", color: "rgba(255,255,255,0.65)", fontSize: 13 }}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>

          <a href="https://wa.me/521234567890?text=Hola, me gustaría agendar una primera consulta"
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all hover:opacity-90"
            style={{ backgroundColor: C.white, color: C.blueDark, fontFamily: "Source Sans 3, sans-serif", borderRadius: 4 }}>
            <MessageCircle size={15} />
            Contactar por WhatsApp
          </a>
        </SlideIn>

        <SlideIn delay={0.15}>
          <AnimatePresence mode="wait">
            {form.status === "success" ? (
              <DemoConfirmation
                key="confirmation"
                onReset={() => form.reset(true)}
                onClose={() => form.reset(false)}
                accentColor={C.blueLight}
                borderColor="rgba(255,255,255,0.15)"
                fontFamily="Source Sans 3, sans-serif"
                radius={4}
              />
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
                onSubmit={form.handleSubmit}
                noValidate
              >
                <div>
                  <label style={{ fontFamily: "Source Sans 3, sans-serif", color: "rgba(255,255,255,0.5)", fontSize: 12, letterSpacing: "0.06em" }}
                    className="block mb-1.5 uppercase">
                    Nombre completo
                  </label>
                  <input type="text" placeholder="Su nombre" ref={nombreRef}
                    value={form.values.nombre} onChange={form.handleChange("nombre")}
                    className="w-full px-4 py-2.5 text-white focus:outline-none"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.07)",
                      border: `1px solid ${form.errors.nombre ? "#F87171" : "rgba(255,255,255,0.12)"}`,
                      fontFamily: "Source Sans 3, sans-serif",
                      fontSize: 14,
                      borderRadius: 4,
                    }} />
                  {form.errors.nombre && <p className="mt-1 text-xs" style={{ color: "#FCA5A5", fontFamily: "Source Sans 3, sans-serif" }}>{form.errors.nombre}</p>}
                </div>
                <div>
                  <label style={{ fontFamily: "Source Sans 3, sans-serif", color: "rgba(255,255,255,0.5)", fontSize: 12, letterSpacing: "0.06em" }}
                    className="block mb-1.5 uppercase">
                    Correo electrónico
                  </label>
                  <input type="email" placeholder="correo@ejemplo.com"
                    value={form.values.correo} onChange={form.handleChange("correo")}
                    className="w-full px-4 py-2.5 text-white focus:outline-none"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.07)",
                      border: `1px solid ${form.errors.correo ? "#F87171" : "rgba(255,255,255,0.12)"}`,
                      fontFamily: "Source Sans 3, sans-serif",
                      fontSize: 14,
                      borderRadius: 4,
                    }} />
                  {form.errors.correo && <p className="mt-1 text-xs" style={{ color: "#FCA5A5", fontFamily: "Source Sans 3, sans-serif" }}>{form.errors.correo}</p>}
                </div>
                <div>
                  <label style={{ fontFamily: "Source Sans 3, sans-serif", color: "rgba(255,255,255,0.5)", fontSize: 12, letterSpacing: "0.06em" }}
                    className="block mb-1.5 uppercase">
                    Motivo de consulta
                  </label>
                  <select value={form.values.motivo} onChange={form.handleChange("motivo")}
                    className="w-full px-4 py-2.5 text-white focus:outline-none"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.07)",
                      border: `1px solid ${form.errors.motivo ? "#F87171" : "rgba(255,255,255,0.12)"}`,
                      fontFamily: "Source Sans 3, sans-serif",
                      fontSize: 14,
                      borderRadius: 4,
                    }}>
                    <option value="" className="bg-gray-900">Seleccione una opción</option>
                    {["Ansiedad o estrés", "Depresión", "Terapia de pareja", "Duelo", "Otro"].map(o => (
                      <option key={o} value={o} className="bg-gray-900">{o}</option>
                    ))}
                  </select>
                  {form.errors.motivo && <p className="mt-1 text-xs" style={{ color: "#FCA5A5", fontFamily: "Source Sans 3, sans-serif" }}>{form.errors.motivo}</p>}
                </div>
                <div>
                  <label style={{ fontFamily: "Source Sans 3, sans-serif", color: "rgba(255,255,255,0.5)", fontSize: 12, letterSpacing: "0.06em" }}
                    className="block mb-1.5 uppercase">
                    Mensaje
                  </label>
                  <textarea rows={4} placeholder="Describa brevemente su motivo de consulta..."
                    value={form.values.mensaje} onChange={form.handleChange("mensaje")}
                    className="w-full px-4 py-2.5 text-white focus:outline-none resize-none"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.07)",
                      border: `1px solid ${form.errors.mensaje ? "#F87171" : "rgba(255,255,255,0.12)"}`,
                      fontFamily: "Source Sans 3, sans-serif",
                      fontSize: 14,
                      borderRadius: 4,
                    }} />
                  {form.errors.mensaje && <p className="mt-1 text-xs" style={{ color: "#FCA5A5", fontFamily: "Source Sans 3, sans-serif" }}>{form.errors.mensaje}</p>}
                </div>
                <motion.button
                  type="submit"
                  disabled={form.status === "submitting"}
                  whileHover={{ opacity: form.status === "submitting" ? 1 : 0.9 }}
                  whileTap={{ scale: form.status === "submitting" ? 1 : 0.98 }}
                  className="w-full py-3 text-sm font-medium disabled:opacity-70"
                  style={{
                    backgroundColor: C.blueLight,
                    color: C.white,
                    fontFamily: "Source Sans 3, sans-serif",
                    borderRadius: 4,
                  }}>
                  {form.status === "submitting" ? "Enviando..." : "Enviar solicitud"}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </SlideIn>
      </div>
    </section>
  )
}

function Footer() {
  const [privacyOpen, setPrivacyOpen] = useState(false)

  return (
    <footer className="py-6 px-8 flex flex-col md:flex-row items-center justify-between gap-2"
      style={{ backgroundColor: "#111B2A", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <p style={{ fontFamily: "Source Sans 3, sans-serif", color: "rgba(255,255,255,0.25)", fontSize: 12 }}>
        © 2026 Dra. Valeria Romero · Psicóloga Clínica · Cédula 12345678
      </p>
      <p style={{ fontFamily: "Source Sans 3, sans-serif", fontSize: 11 }}>
        <button onClick={() => setPrivacyOpen(true)}
          className="underline-offset-2 hover:underline transition-all"
          style={{ color: "rgba(255,255,255,0.35)", fontFamily: "Source Sans 3, sans-serif" }}>
          Aviso de privacidad
        </button>
        <span style={{ color: "rgba(255,255,255,0.15)" }}> · Confidencialidad garantizada</span>
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
  return (
    <div style={{ backgroundColor: C.bgLight }}>
      <Navbar />
      <Hero />
      <Identificacion />
      <SobreMi />
      <Servicios />
      <PrimeraCita />
      <Resenas />
      <Contacto />
      <Footer />
    </div>
  )
}