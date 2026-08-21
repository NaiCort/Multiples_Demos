import { useEffect, useRef, useState } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Phone, MapPin, Clock, ChevronRight, ChevronLeft, MessageCircle, ArrowRight, Star } from "lucide-react"
import useContactForm from "../hooks/useContactForm"
import DemoConfirmation from "../components/shared/DemoConfirmation"
import PrivacyModal from "../components/shared/PrivacyModal"

const C = {
  white: "#FFFFFF",
  black: "#0A0A0A",
  gray100: "#F5F5F5",
  gray200: "#E8E8E8",
  gray400: "#AAAAAA",
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
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  return (
    <motion.div
      ref={ref}
      initial={{ scaleX: 0 }}
      animate={inView ? { scaleX: 1 } : {}}
      transition={{ duration: 0.7, delay, ease: "easeInOut" }}
      style={{ originX: 0, height: 1, backgroundColor: C.gray200 }}
      className="w-full"
    />
  )
}

// Fade puro sin movimiento
function FadePure({ children, delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.7, delay }}
    >
      {children}
    </motion.div>
  )
}

// Texto que aparece letra por letra
function TypeWriter({ text, delay = 0 }) {
  const words = text.split(" ")
  return (
    <span>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: delay + i * 0.06, ease: "easeOut" }}
          style={{ display: "inline-block", marginRight: "0.25em" }}
        >
          {word}
        </motion.span>
      ))}
    </span>
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
        backgroundColor: scrolled ? "rgba(255,255,255,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(8px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.gray200}` : "none",
        transition: "all 0.3s ease",
      }}
    >
      <div className="max-w-6xl mx-auto px-8 py-5 flex items-center justify-between">
        <span style={{ fontFamily: "DM Serif Display, serif", color: C.black, fontSize: 18, letterSpacing: "-0.02em" }}>
          Dra. Valeria Romero
        </span>

        <div className="hidden md:flex items-center gap-10">
          {links.map(l => (
            <a key={l.label} href={l.href}
              style={{ color: C.gray600, fontFamily: "DM Sans, sans-serif", fontSize: 13, letterSpacing: "0.04em" }}
              className="hover:opacity-50 transition-opacity uppercase tracking-widest">
              {l.label}
            </a>
          ))}
        </div>

        <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
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

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden absolute top-full left-0 right-0 py-8 px-8 flex flex-col gap-6"
            style={{ backgroundColor: C.white, borderBottom: `1px solid ${C.gray200}`, minHeight: "100dvh" }}
          >
            {links.map((l, i) => (
              <motion.a
                key={l.label} href={l.href}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{ color: C.black, fontFamily: "DM Serif Display, serif", fontSize: 22 }}
                onClick={() => setMenuOpen(false)}>
                {l.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center pt-[140px] pb-16 px-8"
      style={{ backgroundColor: C.white }}>
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h1 style={{ fontFamily: "DM Serif Display, serif", color: C.black, lineHeight: 1.1, fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
              className="mb-8">
              <TypeWriter text="Terapia psicológica para quien está listo para avanzar." delay={0.2} />
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              style={{ fontFamily: "DM Sans, sans-serif", color: C.gray600, lineHeight: 1.8, fontSize: 16 }}
              className="mb-10 max-w-md"
            >
              Un espacio de escucha y trabajo genuino. Sin fórmulas genéricas,
              sin promesas vacías. Solo el proceso que tú necesitas.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a href="https://wa.me/521234567890?text=Hola, me gustaría agendar una cita"
                target="_blank" rel="noopener noreferrer"
                className="group flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all duration-200"
                style={{ backgroundColor: C.black, color: C.white, fontFamily: "DM Sans, sans-serif", letterSpacing: "0.04em" }}>
                Agendar primera consulta
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#sobre-mi"
                className="flex items-center gap-2 px-6 py-3 text-sm border transition-all duration-200 hover:bg-gray-50"
                style={{ borderColor: C.gray200, color: C.black, fontFamily: "DM Sans, sans-serif" }}>
                Conocer el enfoque
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="relative hidden md:block"
          >
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80"
              alt="Psicóloga"
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
            Dra. Valeria Romero
          </h2>
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
              "Cédula profesional: 12345678",
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
              src="https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=600&q=80"
              alt="Consultorio"
              className="w-full object-cover"
              style={{ height: 480, filter: "grayscale(10%)" }}
            />
            <div className="grid grid-cols-3 gap-0 mt-0 border-t"
              style={{ borderColor: C.gray200 }}>
              {[
                { n: "412", label: "Pacientes" },
                { n: "8+", label: "Años" },
                { n: "94%", label: "Satisfacción" },
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

function Servicios() {
  const items = [
    { title: "Terapia Individual", desc: "Trabajamos con lo que realmente te está pasando, sin fórmulas genéricas. Cada sesión tiene un objetivo claro y revisamos juntos si te está funcionando.", duration: "50 min", mode: "Presencial u online" },
    { title: "Terapia de Pareja", desc: "Ambos hablan, yo modero. Identificamos qué se repite en sus conflictos y probamos formas distintas de resolverlos.", duration: "60 min", mode: "Presencial u online" },
    { title: "Orientación Psicológica", desc: "Para algo puntual, no para un proceso largo. Pocas sesiones, un tema concreto, salidas claras.", duration: "45 min", mode: "Online" },
  ]

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
              <motion.div
                className="py-8 grid grid-cols-12 gap-4 items-center cursor-default group"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
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
                </div>
              </motion.div>
            </FadePure>
          ))}
          <DrawLine />
        </div>
      </div>
    </section>
  )
}

function PrimeraCita() {
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
            className="p-2 hover:opacity-60 transition-opacity">
            <ChevronLeft size={18} style={{ color: C.black }} />
          </button>
          <span style={{ fontFamily: "DM Sans, sans-serif", color: C.gray400, fontSize: 12 }}>
            {index + 1} / {reviews.length}
          </span>
          <button onClick={next} aria-label="Siguiente reseña"
            className="p-2 hover:opacity-60 transition-opacity">
            <ChevronRight size={18} style={{ color: C.black }} />
          </button>
        </div>
      </div>
    </section>
  )
}

function Contacto() {
  const nombreRef = useRef(null)
  const form = useContactForm({ nombreRef })

  return (
    <section id="contacto" className="py-24 px-8" style={{ backgroundColor: C.black, scrollMarginTop: 134 }}>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20">
        <FadePure>
          <p style={{ fontFamily: "DM Sans, sans-serif", color: "rgba(255,255,255,0.3)", fontSize: 11, letterSpacing: "0.12em" }}
            className="uppercase mb-4">
            Contacto
          </p>
          <h2 style={{ fontFamily: "DM Serif Display, serif", color: C.white, fontSize: "clamp(1.8rem, 3vw, 2.5rem)" }}
            className="mb-8">
            Cuando estés listo/a, aquí estaré.
          </h2>

          <div className="space-y-4 mb-10">
            {[
              { icon: Phone, text: "+52 (123) 456-7890" },
              { icon: MapPin, text: "Xalapa, Veracruz, México" },
              { icon: Clock, text: "Lunes a Viernes · 9:00 – 19:00" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <item.icon size={15} style={{ color: "rgba(255,255,255,0.3)" }} />
                <span style={{ fontFamily: "DM Sans, sans-serif", color: "rgba(255,255,255,0.6)", fontSize: 14 }}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>

          <a href="https://wa.me/521234567890?text=Hola, me gustaría agendar una primera cita"
            target="_blank" rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all duration-200 hover:opacity-80"
            style={{ backgroundColor: C.white, color: C.black, fontFamily: "DM Sans, sans-serif" }}>
            <MessageCircle size={15} />
            Escribir por WhatsApp
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </FadePure>

        <FadePure delay={0.15}>
          <AnimatePresence mode="wait">
            {form.status === "success" ? (
              <DemoConfirmation
                key="confirmation"
                onReset={() => form.reset(true)}
                onClose={() => form.reset(false)}
                accentColor={C.white}
                accentTextColor={C.black}
                borderColor="rgba(255,255,255,0.15)"
                fontFamily="DM Sans, sans-serif"
                radius={0}
              />
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
                onSubmit={form.handleSubmit}
                noValidate
              >
                <div className="border-b pb-2" style={{ borderColor: form.errors.nombre ? "#F87171" : "rgba(255,255,255,0.1)" }}>
                  <label style={{ fontFamily: "DM Sans, sans-serif", color: "rgba(255,255,255,0.3)", fontSize: 11, letterSpacing: "0.08em" }}
                    className="block uppercase mb-2">
                    Nombre
                  </label>
                  <input type="text" placeholder="Tu nombre" ref={nombreRef}
                    value={form.values.nombre} onChange={form.handleChange("nombre")}
                    className="w-full bg-transparent focus:outline-none"
                    style={{ fontFamily: "DM Sans, sans-serif", color: C.white, fontSize: 15 }} />
                  {form.errors.nombre && <p className="mt-1 text-xs" style={{ color: "#FCA5A5", fontFamily: "DM Sans, sans-serif" }}>{form.errors.nombre}</p>}
                </div>
                <div className="border-b pb-2" style={{ borderColor: form.errors.correo ? "#F87171" : "rgba(255,255,255,0.1)" }}>
                  <label style={{ fontFamily: "DM Sans, sans-serif", color: "rgba(255,255,255,0.3)", fontSize: 11, letterSpacing: "0.08em" }}
                    className="block uppercase mb-2">
                    Correo electrónico
                  </label>
                  <input type="email" placeholder="tu@correo.com"
                    value={form.values.correo} onChange={form.handleChange("correo")}
                    className="w-full bg-transparent focus:outline-none"
                    style={{ fontFamily: "DM Sans, sans-serif", color: C.white, fontSize: 15 }} />
                  {form.errors.correo && <p className="mt-1 text-xs" style={{ color: "#FCA5A5", fontFamily: "DM Sans, sans-serif" }}>{form.errors.correo}</p>}
                </div>
                <div className="border-b pb-2" style={{ borderColor: form.errors.motivo ? "#F87171" : "rgba(255,255,255,0.1)" }}>
                  <label style={{ fontFamily: "DM Sans, sans-serif", color: "rgba(255,255,255,0.3)", fontSize: 11, letterSpacing: "0.08em" }}
                    className="block uppercase mb-2">
                    Motivo
                  </label>
                  <select value={form.values.motivo} onChange={form.handleChange("motivo")}
                    className="w-full bg-transparent focus:outline-none"
                    style={{ fontFamily: "DM Sans, sans-serif", color: "rgba(255,255,255,0.6)", fontSize: 15 }}>
                    <option value="" className="bg-gray-900">Selecciona</option>
                    {["Ansiedad o estrés", "Depresión", "Terapia de pareja", "Duelo", "Otro"].map(o => (
                      <option key={o} value={o} className="bg-gray-900">{o}</option>
                    ))}
                  </select>
                  {form.errors.motivo && <p className="mt-1 text-xs" style={{ color: "#FCA5A5", fontFamily: "DM Sans, sans-serif" }}>{form.errors.motivo}</p>}
                </div>
                <div className="border-b pb-2" style={{ borderColor: form.errors.mensaje ? "#F87171" : "rgba(255,255,255,0.1)" }}>
                  <label style={{ fontFamily: "DM Sans, sans-serif", color: "rgba(255,255,255,0.3)", fontSize: 11, letterSpacing: "0.08em" }}
                    className="block uppercase mb-2">
                    Mensaje
                  </label>
                  <textarea rows={3} placeholder="Cuéntame brevemente..."
                    value={form.values.mensaje} onChange={form.handleChange("mensaje")}
                    className="w-full bg-transparent focus:outline-none resize-none"
                    style={{ fontFamily: "DM Sans, sans-serif", color: C.white, fontSize: 15 }} />
                  {form.errors.mensaje && <p className="mt-1 text-xs" style={{ color: "#FCA5A5", fontFamily: "DM Sans, sans-serif" }}>{form.errors.mensaje}</p>}
                </div>
                <motion.button
                  type="submit"
                  disabled={form.status === "submitting"}
                  whileHover={{ opacity: form.status === "submitting" ? 1 : 0.85 }}
                  whileTap={{ scale: form.status === "submitting" ? 1 : 0.98 }}
                  className="w-full py-3 text-sm font-medium uppercase tracking-widest disabled:opacity-70"
                  style={{ backgroundColor: C.white, color: C.black, fontFamily: "DM Sans, sans-serif", letterSpacing: "0.1em" }}>
                  {form.status === "submitting" ? "Enviando..." : "Enviar mensaje"}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </FadePure>
      </div>
    </section>
  )
}

function Monogram() {
  return (
    <div className="w-8 h-8 rounded-full border flex items-center justify-center shrink-0"
      style={{ borderColor: "rgba(255,255,255,0.25)" }}>
      <span style={{ fontFamily: "DM Serif Display, serif", color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
        VR
      </span>
    </div>
  )
}

function Footer() {
  const [privacyOpen, setPrivacyOpen] = useState(false)

  return (
    <footer className="py-6 px-8 flex flex-col md:flex-row items-center justify-between gap-4"
      style={{ backgroundColor: C.black, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <p style={{ fontFamily: "DM Sans, sans-serif", color: "rgba(255,255,255,0.2)", fontSize: 12 }}>
        © 2026 Dra. Valeria Romero
      </p>

      <Monogram />

      <button onClick={() => setPrivacyOpen(true)}
        className="underline-offset-2 hover:underline transition-all"
        style={{ fontFamily: "DM Sans, sans-serif", color: "rgba(255,255,255,0.3)", fontSize: 11 }}>
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
  return (
    <div style={{ backgroundColor: C.white }}>
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