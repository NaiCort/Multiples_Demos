import { useEffect, useRef, useState } from "react"
import { motion, useInView, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { Phone, MapPin, Clock, MessageCircle, Leaf, Wind, Sun } from "lucide-react"
import useContactForm from "../hooks/useContactForm"
import DemoConfirmation from "../components/shared/DemoConfirmation"
import PrivacyModal from "../components/shared/PrivacyModal"

const C = {
  bg: "#F7F9F4",
  white: "#FFFFFF",
  green100: "#EAF0E6",
  green200: "#C8D9C0",
  green500: "#5A8C5A",
  green700: "#3A6B3A",
  green900: "#1E3D1E",
  sage: "#7A9E7E",
  earth: "#8B7355",
  gray: "#5A6650",
  grayLight: "#8A9A80",
}

function useFonts() {
  useEffect(() => {
    if (document.getElementById("font-naturaleza")) return
    const link = document.createElement("link")
    link.id = "font-naturaleza"
    link.rel = "stylesheet"
    link.href =
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Nunito:wght@300;400;500&display=swap"
    document.head.appendChild(link)
  }, [])
}

// Fade muy lento con blur — meditativo
function FadeBlur({ children, delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, filter: "blur(6px)" }}
      animate={inView ? { opacity: 1, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.9, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}

// Elemento flotante decorativo — hojas orgánicas
function FloatingOrb({ size, color, top, left, duration = 8, delay = 0 }) {
  return (
    <motion.div
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: "60% 40% 70% 30% / 50% 60% 40% 50%",
        backgroundColor: color,
        top,
        left,
        zIndex: 0,
        pointerEvents: "none",
      }}
      animate={{
        borderRadius: [
          "60% 40% 70% 30% / 50% 60% 40% 50%",
          "40% 60% 30% 70% / 60% 40% 50% 50%",
          "60% 40% 70% 30% / 50% 60% 40% 50%",
        ],
        y: [0, -12, 0],
        rotate: [0, 5, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
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
      className="fixed top-11 left-0 right-0 z-30"
      style={{
        backgroundColor: scrolled ? "rgba(247,249,244,0.96)" : "transparent",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.green200}` : "none",
        transition: "all 0.4s ease",
      }}
    >
      <div className="max-w-6xl mx-auto px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Leaf size={16} style={{ color: C.green500 }} />
          <span style={{ fontFamily: "Cormorant Garamond, serif", color: C.green900, fontSize: 19, fontWeight: 400 }}>
            Dra. Valeria Romero
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <a key={l.label} href={l.href}
              style={{ color: C.gray, fontFamily: "Nunito, sans-serif", fontSize: 14, fontWeight: 400 }}
              className="hover:opacity-50 transition-opacity">
              {l.label}
            </a>
          ))}
          <a href="https://wa.me/521234567890?text=Hola, me gustaría agendar una cita"
            target="_blank" rel="noopener noreferrer"
            className="px-5 py-2 text-white text-sm transition-all hover:opacity-90 rounded-full"
            style={{ backgroundColor: C.green500, fontFamily: "Nunito, sans-serif" }}>
            Agendar cita
          </a>
        </div>

        <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
          <div className="space-y-1.5">
            <motion.div animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 8 : 0 }}
              className="w-6 h-px" style={{ backgroundColor: C.green700 }} />
            <motion.div animate={{ opacity: menuOpen ? 0 : 1 }}
              className="w-6 h-px" style={{ backgroundColor: C.green700 }} />
            <motion.div animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -8 : 0 }}
              className="w-6 h-px" style={{ backgroundColor: C.green700 }} />
          </div>
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="md:hidden absolute top-full left-0 right-0 py-8 px-8 flex flex-col gap-5"
            style={{ backgroundColor: "rgba(247,249,244,0.98)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${C.green200}` }}
          >
            {links.map(l => (
              <a key={l.label} href={l.href}
                style={{ color: C.green900, fontFamily: "Cormorant Garamond, serif", fontSize: 22 }}
                onClick={() => setMenuOpen(false)}>{l.label}</a>
            ))}
            <a href="https://wa.me/521234567890"
              className="mt-2 py-3 text-white text-center rounded-full"
              style={{ backgroundColor: C.green500, fontFamily: "Nunito, sans-serif" }}>
              Agendar cita
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])
  const orbScale = useTransform(scrollYProgress, [0, 1], [1, 1.7])
  const orbOpacity = useTransform(scrollYProgress, [0, 1], [1, 0])

  return (
    <section ref={ref} className="min-h-screen flex items-center pt-[124px] pb-16 px-8 relative overflow-hidden"
      style={{ backgroundColor: C.bg }}>

      {/* Orbes decorativos flotantes — se disuelven al hacer scroll, como una respiración lenta */}
      <motion.div style={{ scale: orbScale, opacity: orbOpacity }}>
        <FloatingOrb size={180} color={`${C.green200}45`} top="10%" left="5%" duration={9} delay={0} />
        <FloatingOrb size={80} color={`${C.earth}20`} top="30%" left="75%" duration={7} delay={1} />
      </motion.div>

      <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-16 items-center relative z-10">
        <div>
          <motion.h1
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.1, delay: 0.15 }}
            style={{
              fontFamily: "Cormorant Garamond, serif",
              color: C.green900,
              lineHeight: 1.2,
              fontSize: "clamp(2.4rem, 5vw, 4rem)",
              fontWeight: 300,
            }}
            className="mb-6"
          >
            Encontrar calma en medio del caos es posible
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            style={{ fontFamily: "Nunito, sans-serif", color: C.gray, lineHeight: 1.85, fontSize: 15, fontWeight: 300 }}
            className="mb-10 max-w-lg"
          >
            Soy psicóloga clínica y ofrezco un espacio de quietud y trabajo interior,
            donde puedes volver a conectar contigo mismo/a y encontrar el camino hacia el bienestar.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a href="https://wa.me/521234567890?text=Hola, me gustaría agendar una primera cita"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3 text-white text-sm rounded-full transition-all hover:opacity-90"
              style={{ backgroundColor: C.green500, fontFamily: "Nunito, sans-serif" }}>
              <MessageCircle size={16} />
              Comenzar el proceso
            </a>
            <a href="#sobre-mi"
              className="flex items-center justify-center gap-2 px-6 py-3 text-sm rounded-full border transition-all hover:bg-green-50"
              style={{ borderColor: C.green200, color: C.green700, fontFamily: "Nunito, sans-serif" }}>
              Conocer mi enfoque
            </a>
          </motion.div>
        </div>

        {/* Imagen con parallax sutil */}
        <motion.div
          initial={{ opacity: 0, filter: "blur(8px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="hidden md:block relative"
          style={{ y: bgY }}
        >
          <div style={{
            borderRadius: "60% 40% 55% 45% / 50% 45% 55% 50%",
            overflow: "hidden",
            width: "100%",
            height: 520,
          }}>
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80"
              alt="Psicóloga"
              className="w-full h-full object-cover"
              style={{ filter: "saturate(0.85)" }}
            />
          </div>
          {/* Badge flotante */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-8 -left-6 p-4 rounded-2xl shadow-lg"
            style={{ backgroundColor: C.white, border: `1px solid ${C.green200}` }}
          >
            <div className="flex items-center gap-2">
              <Sun size={16} style={{ color: C.earth }} />
              <div>
                <p style={{ fontFamily: "Cormorant Garamond, serif", color: C.green900, fontSize: 14 }}>8+ años</p>
                <p style={{ fontFamily: "Nunito, sans-serif", color: C.grayLight, fontSize: 11 }}>acompañando procesos</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function Identificacion() {
  const items = [
    { icon: Wind, title: "Ansiedad y agotamiento", desc: "Cuando la mente no descansa y el cuerpo acusa el peso de las preocupaciones." },
    { icon: Leaf, title: "Desconexión interior", desc: "Sensación de no reconocerse, de estar lejos de lo que alguna vez se fue." },
    { icon: Sun, title: "Transiciones vitales", desc: "Cambios importantes que descolocan y piden una nueva manera de estar en el mundo." },
  ]

  return (
    <section className="py-24 px-8" style={{ backgroundColor: C.white }}>
      <div className="max-w-6xl mx-auto">
        <FadeBlur>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", color: C.green900, fontSize: "clamp(1.8rem, 3vw, 2.8rem)", fontWeight: 300 }}
            className="mb-4">
            ¿Algo de esto resuena contigo?
          </h2>
          <p style={{ fontFamily: "Nunito, sans-serif", color: C.grayLight, fontSize: 14, fontWeight: 300 }}
            className="mb-16 max-w-lg">
            Muchas personas llegan aquí cargando algo que no saben del todo cómo nombrar.
          </p>
        </FadeBlur>

        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <FadeBlur key={i} delay={i * 0.15}>
              <motion.div
                className="p-8 rounded-3xl cursor-default"
                style={{ backgroundColor: C.bg }}
                whileHover={{ y: -5, backgroundColor: C.green100 }}
                transition={{ duration: 0.3 }}
              >
                <item.icon size={24} className="mb-5" style={{ color: C.sage }} />
                <h3 style={{ fontFamily: "Cormorant Garamond, serif", color: C.green900, fontSize: 20, fontWeight: 400 }}
                  className="mb-3">
                  {item.title}
                </h3>
                <p style={{ fontFamily: "Nunito, sans-serif", color: C.gray, fontSize: 14, lineHeight: 1.75, fontWeight: 300 }}>
                  {item.desc}
                </p>
              </motion.div>
            </FadeBlur>
          ))}
        </div>
      </div>
    </section>
  )
}

function SobreMi() {
  return (
    <section id="sobre-mi" className="py-24 px-8 relative overflow-hidden" style={{ backgroundColor: C.bg, scrollMarginTop: 144 }}>
      <FloatingOrb size={300} color={`${C.green200}30`} top="-10%" left="-5%" duration={14} delay={0} />

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">
        <FadeBlur>
          <div style={{ borderRadius: "50% 50% 40% 60% / 45% 55% 45% 55%", overflow: "hidden", height: 480 }}>
            <img
              src="https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=600&q=80"
              alt="Consultorio"
              className="w-full h-full object-cover"
              style={{ filter: "saturate(0.8)" }}
            />
          </div>
        </FadeBlur>

        <div>
          <FadeBlur delay={0.1}>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", color: C.green900, fontSize: "clamp(1.8rem, 3vw, 2.8rem)", fontWeight: 300, lineHeight: 1.3 }}
              className="mb-6">
              Dra. Valeria Romero
            </h2>
            <p style={{ fontFamily: "Nunito, sans-serif", color: C.gray, lineHeight: 1.9, fontSize: 14, fontWeight: 300 }}
              className="mb-5">
              Creo que cada persona lleva en sí misma la capacidad de sanar. Mi trabajo es
              acompañar ese proceso con presencia, paciencia y las herramientas adecuadas.
            </p>
            <p style={{ fontFamily: "Nunito, sans-serif", color: C.gray, lineHeight: 1.9, fontSize: 14, fontWeight: 300 }}
              className="mb-8">
              Trabajo principalmente desde la terapia humanista y mindfulness, integrando
              técnicas cognitivo-conductuales cuando el proceso lo requiere.
            </p>
          </FadeBlur>

          <FadeBlur delay={0.2}>
            <div className="space-y-3 mb-8">
              {[
                "Licenciatura en Psicología, UNAM",
                "Maestría en Psicología Clínica, UNAM",
                "Cédula profesional: 12345678",
                "Formación en Mindfulness-Based Cognitive Therapy",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Leaf size={13} style={{ color: C.sage, flexShrink: 0 }} />
                  <span style={{ fontFamily: "Nunito, sans-serif", color: C.gray, fontSize: 13, fontWeight: 300 }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </FadeBlur>

          <FadeBlur delay={0.3}>
            <div className="grid grid-cols-3 gap-4">
              {[
                { n: "412", label: "Pacientes" },
                { n: "8+", label: "Años" },
                { n: "94%", label: "Satisfacción" },
              ].map((s, i) => (
                <div key={i} className="text-center py-4 rounded-2xl"
                  style={{ backgroundColor: C.green100 }}>
                  <p style={{ fontFamily: "Cormorant Garamond, serif", color: C.green700, fontSize: 22 }}>{s.n}</p>
                  <p style={{ fontFamily: "Nunito, sans-serif", color: C.grayLight, fontSize: 11, fontWeight: 300 }}
                    className="mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </FadeBlur>
        </div>
      </div>
    </section>
  )
}

function Servicios() {
  const items = [
    { title: "Terapia Individual", desc: "Un espacio íntimo para explorar, comprender y transformar lo que pesa.", duration: "50 min / sesión", mode: "Presencial u online" },
    { title: "Terapia de Pareja", desc: "Reconectar con el otro desde un lugar más auténtico y compasivo.", duration: "60 min / sesión", mode: "Presencial u online" },
    { title: "Orientación y Acompañamiento", desc: "Para momentos de transición que piden una mirada externa y serena.", duration: "45 min / sesión", mode: "Online" },
  ]

  return (
    <section id="servicios" className="py-24 px-8" style={{ backgroundColor: C.white, scrollMarginTop: 144 }}>
      <div className="max-w-6xl mx-auto">
        <FadeBlur>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", color: C.green900, fontSize: "clamp(1.8rem, 3vw, 2.8rem)", fontWeight: 300 }}
            className="mb-16">
            Formas de acompañamiento
          </h2>
        </FadeBlur>

        <div className="grid md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <FadeBlur key={i} delay={i * 0.15}>
              <motion.div
                className="p-8 rounded-3xl flex flex-col h-full"
                style={{ backgroundColor: C.bg, border: `1px solid ${C.green200}` }}
                whileHover={{ y: -4, boxShadow: `0 16px 48px ${C.green200}80` }}
                transition={{ duration: 0.35 }}
              >
                <h3 style={{ fontFamily: "Cormorant Garamond, serif", color: C.green900, fontSize: 21, fontWeight: 400 }}
                  className="mb-3">
                  {item.title}
                </h3>
                <p style={{ fontFamily: "Nunito, sans-serif", color: C.gray, fontSize: 13, lineHeight: 1.8, fontWeight: 300 }}
                  className="flex-1 mb-5">
                  {item.desc}
                </p>
                <div className="space-y-2 pt-4"
                  style={{ borderTop: `1px solid ${C.green200}` }}>
                  <div className="flex items-center gap-2">
                    <Clock size={13} style={{ color: C.sage }} />
                    <span style={{ fontFamily: "Nunito, sans-serif", color: C.grayLight, fontSize: 12, fontWeight: 300 }}>
                      {item.duration}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={13} style={{ color: C.sage }} />
                    <span style={{ fontFamily: "Nunito, sans-serif", color: C.grayLight, fontSize: 12, fontWeight: 300 }}>
                      {item.mode}
                    </span>
                  </div>
                </div>
              </motion.div>
            </FadeBlur>
          ))}
        </div>
      </div>
    </section>
  )
}

function PrimeraCita() {
  const pasos = [
    { icon: MessageCircle, title: "Escríbeme", desc: "Un mensaje sencillo es suficiente. No necesitas tenerlo todo claro todavía." },
    { icon: Clock, title: "Agendamos", desc: "Encontramos un momento que encaje con tu ritmo y disponibilidad." },
    { icon: Leaf, title: "Nos conocemos", desc: "La primera sesión es un espacio de escucha, sin prisa ni juicio." },
    { icon: Sun, title: "Comenzamos", desc: "Desde ahí, construimos juntos el camino que necesitas." },
  ]

  return (
    <section id="primera-cita" className="py-24 px-8 relative overflow-hidden" style={{ backgroundColor: C.bg, scrollMarginTop: 144 }}>
      <FloatingOrb size={200} color={`${C.green200}25`} top="20%" left="85%" duration={12} delay={3} />

      <div className="max-w-6xl mx-auto relative z-10">
        <FadeBlur>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", color: C.green900, fontSize: "clamp(1.8rem, 3vw, 2.8rem)", fontWeight: 300 }}
            className="mb-4">
            ¿Cómo es el primer encuentro?
          </h2>
          <p style={{ fontFamily: "Nunito, sans-serif", color: C.grayLight, fontSize: 14, fontWeight: 300 }}
            className="mb-16 max-w-lg">
            No hay nada que preparar. Solo necesitas llegar.
          </p>
        </FadeBlur>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pasos.map((paso, i) => (
            <FadeBlur key={i} delay={i * 0.15}>
              <div className="text-center p-8 rounded-3xl" style={{ backgroundColor: C.white }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ backgroundColor: C.green100 }}>
                  <paso.icon size={20} style={{ color: C.green500 }} />
                </div>
                <h3 style={{ fontFamily: "Cormorant Garamond, serif", color: C.green900, fontSize: 18, fontWeight: 400 }}
                  className="mb-2">
                  {paso.title}
                </h3>
                <p style={{ fontFamily: "Nunito, sans-serif", color: C.gray, fontSize: 13, lineHeight: 1.75, fontWeight: 300 }}>
                  {paso.desc}
                </p>
              </div>
            </FadeBlur>
          ))}
        </div>
      </div>
    </section>
  )
}

function Resenas() {
  const reviews = [
    { text: "Por primera vez sentí que podía respirar con calma. El proceso fue transformador.", author: "Paciente anónimo/a, 32 años" },
    { text: "Un espacio genuinamente seguro. Me ayudó a reencontrarme conmigo misma.", author: "Paciente anónimo/a, 27 años" },
    { text: "Llegué agotado y sin saber cómo avanzar. Hoy tengo herramientas reales.", author: "Paciente anónimo/a, 39 años" },
  ]

  return (
    <section id="resenas" className="py-24 px-8" style={{ backgroundColor: C.white, scrollMarginTop: 144 }}>
      <div className="max-w-6xl mx-auto">
        <FadeBlur>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", color: C.green900, fontSize: "clamp(1.8rem, 3vw, 2.8rem)", fontWeight: 300 }}
            className="mb-16">
            Palabras de quienes ya caminaron aquí
          </h2>
        </FadeBlur>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <FadeBlur key={i} delay={i * 0.15}>
              <div className="p-8 rounded-3xl" style={{ backgroundColor: C.bg }}>
                <p style={{ fontFamily: "Cormorant Garamond, serif", color: C.green900, lineHeight: 1.75, fontSize: 17, fontWeight: 300, fontStyle: "italic" }}
                  className="mb-5">
                  "{r.text}"
                </p>
                <p style={{ fontFamily: "Nunito, sans-serif", color: C.grayLight, fontSize: 12, fontWeight: 300 }}>
                  — {r.author}
                </p>
              </div>
            </FadeBlur>
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
    <section id="contacto" className="py-24 px-8 relative overflow-hidden" style={{ backgroundColor: C.green900, scrollMarginTop: 144 }}>
      <FloatingOrb size={300} color="rgba(255,255,255,0.03)" top="-20%" left="-10%" duration={16} delay={0} />

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 relative z-10">
        <FadeBlur>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", color: C.white, fontSize: "clamp(1.8rem, 3vw, 2.8rem)", fontWeight: 300 }}
            className="mb-6">
            Cuando sientas que es el momento
          </h2>
          <p style={{ fontFamily: "Nunito, sans-serif", color: "rgba(255,255,255,0.55)", lineHeight: 1.85, fontSize: 14, fontWeight: 300 }}
            className="mb-8">
            No hay un momento perfecto para empezar. Cualquier momento en que
            decidas dar el paso, aquí estaré.
          </p>

          <div className="space-y-4 mb-10">
            {[
              { icon: Phone, text: "+52 (123) 456-7890" },
              { icon: MapPin, text: "Xalapa, Veracruz, México" },
              { icon: Clock, text: "Lunes a Viernes · 9:00 – 19:00" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <item.icon size={15} style={{ color: "rgba(255,255,255,0.3)" }} />
                <span style={{ fontFamily: "Nunito, sans-serif", color: "rgba(255,255,255,0.55)", fontSize: 14, fontWeight: 300 }}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>

          <a href="https://wa.me/521234567890?text=Hola, me gustaría comenzar el proceso"
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm rounded-full transition-all hover:opacity-90"
            style={{ backgroundColor: C.sage, color: C.white, fontFamily: "Nunito, sans-serif" }}>
            <MessageCircle size={15} />
            Escribir por WhatsApp
          </a>
        </FadeBlur>

        <FadeBlur delay={0.2}>
          <AnimatePresence mode="wait">
            {form.status === "success" ? (
              <DemoConfirmation
                key="confirmation"
                onReset={() => form.reset(true)}
                onClose={() => form.reset(false)}
                accentColor={C.sage}
                borderColor="rgba(255,255,255,0.15)"
                fontFamily="Nunito, sans-serif"
                radius={12}
              />
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-5"
                onSubmit={form.handleSubmit}
                noValidate
              >
                <div>
                  <label style={{ fontFamily: "Nunito, sans-serif", color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 300 }}
                    className="block mb-1.5">
                    Nombre
                  </label>
                  <input type="text" placeholder="Tu nombre" ref={nombreRef}
                    value={form.values.nombre} onChange={form.handleChange("nombre")}
                    className="w-full px-4 py-3 text-white focus:outline-none rounded-xl"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.07)",
                      border: `1px solid ${form.errors.nombre ? "#F87171" : "rgba(255,255,255,0.1)"}`,
                      fontFamily: "Nunito, sans-serif",
                      fontSize: 14,
                      fontWeight: 300,
                    }} />
                  {form.errors.nombre && <p className="mt-1 text-xs" style={{ color: "#FCA5A5", fontFamily: "Nunito, sans-serif" }}>{form.errors.nombre}</p>}
                </div>
                <div>
                  <label style={{ fontFamily: "Nunito, sans-serif", color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 300 }}
                    className="block mb-1.5">
                    Correo
                  </label>
                  <input type="email" placeholder="tu@correo.com"
                    value={form.values.correo} onChange={form.handleChange("correo")}
                    className="w-full px-4 py-3 text-white focus:outline-none rounded-xl"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.07)",
                      border: `1px solid ${form.errors.correo ? "#F87171" : "rgba(255,255,255,0.1)"}`,
                      fontFamily: "Nunito, sans-serif",
                      fontSize: 14,
                      fontWeight: 300,
                    }} />
                  {form.errors.correo && <p className="mt-1 text-xs" style={{ color: "#FCA5A5", fontFamily: "Nunito, sans-serif" }}>{form.errors.correo}</p>}
                </div>
                <div>
                  <label style={{ fontFamily: "Nunito, sans-serif", color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 300 }}
                    className="block mb-1.5">
                    ¿Qué te trae aquí?
                  </label>
                  <select value={form.values.motivo} onChange={form.handleChange("motivo")}
                    className="w-full px-4 py-3 text-white focus:outline-none rounded-xl"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.07)",
                      border: `1px solid ${form.errors.motivo ? "#F87171" : "rgba(255,255,255,0.1)"}`,
                      fontFamily: "Nunito, sans-serif",
                      fontSize: 14,
                      fontWeight: 300,
                    }}>
                    <option value="" className="bg-green-900">Selecciona</option>
                    {["Ansiedad o estrés", "Agotamiento emocional", "Terapia de pareja", "Duelo o pérdida", "Otro"].map(o => (
                      <option key={o} value={o} className="bg-green-900">{o}</option>
                    ))}
                  </select>
                  {form.errors.motivo && <p className="mt-1 text-xs" style={{ color: "#FCA5A5", fontFamily: "Nunito, sans-serif" }}>{form.errors.motivo}</p>}
                </div>
                <div>
                  <label style={{ fontFamily: "Nunito, sans-serif", color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 300 }}
                    className="block mb-1.5">
                    Mensaje
                  </label>
                  <textarea rows={4} placeholder="Cuéntame lo que necesites..."
                    value={form.values.mensaje} onChange={form.handleChange("mensaje")}
                    className="w-full px-4 py-3 text-white focus:outline-none resize-none rounded-xl"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.07)",
                      border: `1px solid ${form.errors.mensaje ? "#F87171" : "rgba(255,255,255,0.1)"}`,
                      fontFamily: "Nunito, sans-serif",
                      fontSize: 14,
                      fontWeight: 300,
                    }} />
                  {form.errors.mensaje && <p className="mt-1 text-xs" style={{ color: "#FCA5A5", fontFamily: "Nunito, sans-serif" }}>{form.errors.mensaje}</p>}
                </div>
                <motion.button
                  type="submit"
                  disabled={form.status === "submitting"}
                  whileHover={{ opacity: form.status === "submitting" ? 1 : 0.9 }}
                  whileTap={{ scale: form.status === "submitting" ? 1 : 0.98 }}
                  className="w-full py-3 text-sm rounded-xl disabled:opacity-70"
                  style={{ backgroundColor: C.sage, color: C.white, fontFamily: "Nunito, sans-serif" }}>
                  {form.status === "submitting" ? "Enviando..." : "Enviar mensaje"}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </FadeBlur>
      </div>
    </section>
  )
}

function Footer() {
  const [privacyOpen, setPrivacyOpen] = useState(false)

  return (
    <footer className="py-6 px-8 text-center"
      style={{ backgroundColor: "#111D0F", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <p style={{ fontFamily: "Nunito, sans-serif", color: "rgba(255,255,255,0.2)", fontSize: 12, fontWeight: 300 }}>
        © 2026 Dra. Valeria Romero · Psicóloga Clínica · Xalapa, Veracruz
      </p>
      <button onClick={() => setPrivacyOpen(true)}
        className="mt-1 underline-offset-2 hover:underline transition-all"
        style={{ fontFamily: "Nunito, sans-serif", color: "rgba(255,255,255,0.35)", fontSize: 11, fontWeight: 300 }}>
        Aviso de privacidad
      </button>

      <PrivacyModal
        isOpen={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
        accentColor={C.sage}
        fontFamily="Nunito, sans-serif"
        radius={16}
      />
    </footer>
  )
}

export default function ThemeNaturaleza() {
  useFonts()
  return (
    <div style={{ backgroundColor: C.bg }}>
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