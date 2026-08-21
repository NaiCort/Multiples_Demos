import { useEffect, useRef, useState } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Phone, MapPin, Clock, Heart, Users, Award, ChevronDown, MessageCircle } from "lucide-react"
import useContactForm from "../hooks/useContactForm"
import DemoConfirmation from "../components/shared/DemoConfirmation"
import PrivacyModal from "../components/shared/PrivacyModal"

const C = {
  cream: "#F8F5F1",
  white: "#FFFFFF",
  sage: "#6B8F71",
  sageDark: "#3D5A45",
  terra: "#C17F5A",
  gray: "#5C5C5C",
  grayLight: "#9A9A9A",
}

function useFonts() {
  useEffect(() => {
    if (document.getElementById("font-calido")) return
    const link = document.createElement("link")
    link.id = "font-calido"
    link.rel = "stylesheet"
    link.href =
      "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600&family=Caveat:wght@500;600&display=swap"
    document.head.appendChild(link)
  }, [])
}

function FadeRise({ children, delay = 0, className = "" }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}

function Counter({ to, suffix = "", duration = 1.5 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = to / (duration * 60)
    const timer = setInterval(() => {
      start += step
      if (start >= to) { setCount(to); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 1000 / 60)
    return () => clearInterval(timer)
  }, [inView, to, duration])

  return <span ref={ref}>{count}{suffix}</span>
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
      className="fixed top-11 left-0 right-0 z-30 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? "rgba(248,245,241,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(8px)" : "none",
        boxShadow: scrolled ? "0 1px 12px rgba(0,0,0,0.08)" : "none",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <span style={{ fontFamily: "Playfair Display, serif", color: C.sageDark, fontSize: 20, fontWeight: 700 }}>
          Dra. Valeria Romero
        </span>

        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <a key={l.label} href={l.href} style={{ color: C.gray, fontFamily: "Inter, sans-serif", fontSize: 14 }}
              className="hover:opacity-70 transition-opacity">{l.label}</a>
          ))}
          <a href="https://wa.me/521234567890?text=Hola, me gustaría agendar una cita"
            target="_blank" rel="noopener noreferrer"
            className="px-4 py-2 rounded-full text-white text-sm font-medium transition-all duration-200 hover:opacity-90"
            style={{ backgroundColor: C.sage, fontFamily: "Inter, sans-serif" }}>
            Agendar cita
          </a>
        </div>

        <button className="md:hidden flex flex-col gap-1.5 p-2" onClick={() => setMenuOpen(!menuOpen)}>
          <motion.span animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 8 : 0 }}
            className="block w-6 h-0.5" style={{ backgroundColor: C.sageDark }} />
          <motion.span animate={{ opacity: menuOpen ? 0 : 1 }}
            className="block w-6 h-0.5" style={{ backgroundColor: C.sageDark }} />
          <motion.span animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -8 : 0 }}
            className="block w-6 h-0.5" style={{ backgroundColor: C.sageDark }} />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="md:hidden absolute top-full left-0 right-0 py-6 px-6 flex flex-col gap-4"
            style={{ backgroundColor: "rgba(248,245,241,0.98)", backdropFilter: "blur(12px)" }}
          >
            {links.map(l => (
              <a key={l.label} href={l.href} style={{ color: C.gray, fontFamily: "Inter, sans-serif", fontSize: 18 }}
                onClick={() => setMenuOpen(false)}>{l.label}</a>
            ))}
            <a href="https://wa.me/521234567890?text=Hola, me gustaría agendar una cita"
              target="_blank" rel="noopener noreferrer"
              className="mt-2 py-3 rounded-full text-white text-center font-medium"
              style={{ backgroundColor: C.sage, fontFamily: "Inter, sans-serif" }}>
              Agendar cita por WhatsApp
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

function GrainOverlay() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
      style={{
        opacity: 0.05,
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  )
}

function Hero() {
  return (
    <section className="min-h-screen flex items-center pt-[124px] pb-20 px-6 relative overflow-hidden"
      style={{ backgroundColor: C.cream }}>
      <GrainOverlay />
      <div className="max-w-4xl mx-auto w-full relative">

        {/* Foto tipo polaroid, pegada con cinta washi — rompe la columna espejo */}
        <motion.div
          initial={{ opacity: 0, rotate: -10, scale: 0.9, y: -10 }}
          animate={{ opacity: 1, rotate: -5, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
          className="hidden md:block absolute top-6 right-0 lg:right-4 z-10"
        >
          <div className="relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 opacity-80"
              style={{ backgroundColor: C.terra, transform: "rotate(3deg)" }} />
            <div className="p-3 pb-9 bg-white" style={{ borderRadius: 3, boxShadow: "0 20px 40px rgba(61,90,69,0.18)" }}>
              <div className="w-48 h-56 lg:w-56 lg:h-64 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80"
                  alt="Psicóloga"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-center mt-3" style={{ fontFamily: "Caveat, cursive", color: C.sageDark, fontSize: 22 }}>
                Dra. Valeria Romero
              </p>
            </div>
          </div>
        </motion.div>

        <div className="max-w-xl pt-2 md:pt-28 md:pr-52 lg:pr-64">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            style={{ fontFamily: "Playfair Display, serif", color: C.sageDark, lineHeight: 1.2 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Un espacio seguro para sanar y crecer
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            style={{ fontFamily: "Inter, sans-serif", color: C.gray, lineHeight: 1.7 }}
            className="text-lg mb-8"
          >
            Soy psicóloga clínica y acompaño a personas que sienten que la ansiedad,
            el estrés o sus relaciones las están superando, para que encuentren
            el camino de vuelta a sí mismas.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <a href="https://wa.me/521234567890?text=Hola, me gustaría agendar una primera cita"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-full text-white font-medium text-sm transition-all duration-200 hover:opacity-90 hover:shadow-lg"
              style={{ backgroundColor: C.sage, fontFamily: "Inter, sans-serif" }}>
              <MessageCircle size={18} />
              Agendar por WhatsApp
            </a>
            <a href="#sobre-mi"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium text-sm border-2 transition-all duration-200 hover:opacity-70"
              style={{ borderColor: C.sage, color: C.sage, fontFamily: "Inter, sans-serif" }}>
              Conoce mi enfoque
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-8 flex items-center gap-2"
          >
            <Award size={16} style={{ color: C.terra }} />
            <span style={{ fontFamily: "Inter, sans-serif", color: C.grayLight, fontSize: 13 }}>
              Cédula profesional: 12345678
            </span>
          </motion.div>
        </div>

        {/* Versión móvil: foto simple debajo del texto, sin el montaje de polaroid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="md:hidden mt-10 flex flex-col items-center"
        >
          <div className="w-40 h-48 overflow-hidden rounded-lg" style={{ boxShadow: "0 12px 28px rgba(61,90,69,0.15)" }}>
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80"
              alt="Psicóloga"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="mt-2" style={{ fontFamily: "Caveat, cursive", color: C.sageDark, fontSize: 20 }}>
            Dra. Valeria Romero
          </p>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
      >
        <ChevronDown size={24} style={{ color: C.grayLight }} />
      </motion.div>
    </section>
  )
}

function Identificacion() {
  const items = [
    { icon: Heart, title: "Siento ansiedad sin razón aparente", desc: "La preocupación constante te impide disfrutar el presente y descansar bien." },
    { icon: Users, title: "Mis relaciones me generan mucho desgaste", desc: "Conflictos repetitivos, dificultad para comunicarte o sentirte solo/a en pareja." },
    { icon: Award, title: "No encuentro motivación para nada", desc: "Todo se siente pesado y sin sentido, aunque sepas que deberías sentirte bien." },
  ]

  return (
    <section className="py-20 px-6" style={{ backgroundColor: C.white }}>
      <div className="max-w-3xl mx-auto">
        <FadeRise>
          <h2 className="text-3xl md:text-4xl font-bold mb-4"
            style={{ fontFamily: "Playfair Display, serif", color: C.sageDark }}>
            ¿Te identificas con algo de esto?
          </h2>
          <p className="mb-14" style={{ fontFamily: "Inter, sans-serif", color: C.grayLight }}>
            Si es así, no estás solo/a. Es el primer paso reconocerlo.
          </p>
        </FadeRise>

        <div className="space-y-10">
          {items.map((item, i) => (
            <FadeRise key={i} delay={i * 0.12}>
              <div className="flex gap-5 md:gap-8 items-start" style={{ marginLeft: i % 2 === 1 ? "auto" : 0, maxWidth: "90%" }}>
                <div className="flex-shrink-0 mt-1">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${C.terra}18` }}>
                    <item.icon size={20} style={{ color: C.terra }} />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-1.5 text-xl"
                    style={{ fontFamily: "Playfair Display, serif", color: C.sageDark }}>
                    {item.title}
                  </h3>
                  <p style={{ fontFamily: "Inter, sans-serif", color: C.gray, lineHeight: 1.65, fontSize: 15 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
              {i < items.length - 1 && (
                <div className="mt-10 ml-5" style={{ width: 1, height: 24, backgroundColor: `${C.sage}30` }} />
              )}
            </FadeRise>
          ))}
        </div>
      </div>
    </section>
  )
}

function LeafBullet({ color }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0">
      <path d="M7 1C7 1 12 3 12 7.5C12 10.5 9.5 13 7 13C4.5 13 2 10.5 2 7.5C2 3 7 1 7 1Z"
        fill={color} opacity="0.85" />
      <path d="M7 2V12" stroke="white" strokeWidth="0.6" opacity="0.5" />
    </svg>
  )
}


function SobreMi() {
  const credenciales = [
    { text: "Licenciatura en Psicología, UNAM", rotate: -3 },
    { text: "Maestría en Psicología Clínica, UNAM", rotate: 2.5 },
    { text: "Cédula profesional: 12345678", rotate: -2 },
    { text: "Especialidad en Terapia Cognitivo-Conductual", rotate: 3 },
  ]

  return (
    <section id="sobre-mi" className="py-24 px-6" style={{ backgroundColor: C.cream, scrollMarginTop: 140 }}>
      <div className="max-w-5xl mx-auto">
        <FadeRise>
          <h2 className="text-3xl md:text-4xl font-bold mb-10"
            style={{ fontFamily: "Playfair Display, serif", color: C.sageDark }}>
            Dra. Valeria Romero
          </h2>
        </FadeRise>

        {/* Grid asimétrico (no 50/50) con la foto desplazada hacia abajo — rompe el espejo de los otros temas */}
        <div className="grid md:grid-cols-[1.3fr_1fr] gap-10 md:gap-14 items-start">
          <div>
            <FadeRise delay={0.1}>
              <p className="mb-4" style={{ fontFamily: "Inter, sans-serif", color: C.gray, lineHeight: 1.8 }}>
                Soy psicóloga clínica con más de 8 años acompañando a personas que atraviesan momentos difíciles.
                Creo profundamente en que cada persona tiene los recursos para sanar; a veces solo necesitamos
                un espacio seguro para encontrarlos.
              </p>
              <p className="mb-8" style={{ fontFamily: "Inter, sans-serif", color: C.gray, lineHeight: 1.8 }}>
                Mi enfoque integra la terapia cognitivo-conductual con técnicas humanistas, adaptándome siempre
                a lo que cada persona necesita en su proceso.
              </p>
            </FadeRise>

            {/* Un solo número grande, integrado, en vez de tres sellos pequeños */}
            <FadeRise delay={0.18}>
              <div className="flex items-center gap-5 mb-10 pb-8" style={{ borderBottom: `1px solid ${C.sage}25` }}>
                <p className="flex-shrink-0" style={{ fontFamily: "Playfair Display, serif", color: C.sageDark, fontSize: 48, lineHeight: 1 }}>
                  <Counter to={8} suffix="+" />
                </p>
                <p style={{ fontFamily: "Inter, sans-serif", color: C.gray, fontSize: 14, lineHeight: 1.6 }}>
                  años de experiencia clínica, acompañando a más de <strong style={{ color: C.sageDark }}>412 pacientes</strong> con
                  un <strong style={{ color: C.sageDark }}>94% de satisfacción</strong> reportada en sus procesos.
                </p>
              </div>
            </FadeRise>

            <FadeRise delay={0.25}>
              <div className="flex flex-wrap gap-3">
                {credenciales.map((item, i) => (
                  <div key={i} className="inline-flex items-center gap-1.5 px-3.5 py-2"
                    style={{ backgroundColor: C.white, borderRadius: 3, transform: `rotate(${item.rotate}deg)`, boxShadow: "0 4px 12px rgba(61,90,69,0.1)" }}>
                    <LeafBullet color={C.terra} />
                    <span style={{ fontFamily: "Inter, sans-serif", color: C.gray, fontSize: 13 }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </FadeRise>
          </div>

          {/* Foto desplazada hacia abajo respecto al texto — asimetría real, no columna espejo */}
          <FadeRise delay={0.15} className="md:mt-20">
            <div className="p-2 bg-white mx-auto" style={{ maxWidth: 300, borderRadius: 4, boxShadow: "0 24px 48px rgba(61,90,69,0.18)", transform: "rotate(2.5deg)" }}>
              <img
                src="https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=600&q=80"
                alt="Consultorio"
                className="w-full object-cover"
                style={{ height: 300, borderRadius: 2 }}
              />
            </div>
          </FadeRise>
        </div>
      </div>
    </section>
  )
}

function Servicios() {
  const items = [
    { title: "Terapia Individual", desc: "Un espacio personal para explorar tus pensamientos, emociones y patrones de conducta. Trabajamos juntos hacia el bienestar.", duration: "50 min / sesión", mode: "Presencial u online" },
    { title: "Terapia de Pareja", desc: "Fortalecemos la comunicación, trabajamos conflictos y construimos una relación más sana y satisfactoria para ambos.", duration: "60 min / sesión", mode: "Presencial u online" },
    { title: "Orientación Psicológica", desc: "Sesiones breves enfocadas en una situación específica que necesitas resolver o entender mejor.", duration: "45 min / sesión", mode: "Online" },
  ]

  return (
    <section id="servicios" className="py-20 px-6" style={{ backgroundColor: C.white, scrollMarginTop: 140 }}>
      <div className="max-w-6xl mx-auto">
        <FadeRise>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4"
            style={{ fontFamily: "Playfair Display, serif", color: C.sageDark }}>
            Servicios
          </h2>
          <p className="text-center mb-12 max-w-xl mx-auto"
            style={{ fontFamily: "Inter, sans-serif", color: C.grayLight }}>
            Cada proceso es único. Adapto el trabajo a lo que tú necesitas.
          </p>
        </FadeRise>

        <div className="grid md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <FadeRise key={i} delay={i * 0.12}>
              <motion.div
                className="p-6 rounded-2xl border flex flex-col h-full"
                style={{ borderColor: `${C.sage}30`, backgroundColor: C.cream }}
                whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(107,143,113,0.12)" }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="font-bold text-xl mb-3"
                  style={{ fontFamily: "Playfair Display, serif", color: C.sageDark }}>
                  {item.title}
                </h3>
                <p className="flex-1 mb-4" style={{ fontFamily: "Inter, sans-serif", color: C.gray, lineHeight: 1.65, fontSize: 14 }}>
                  {item.desc}
                </p>
                <div className="space-y-1 pt-4 border-t" style={{ borderColor: `${C.sage}20` }}>
                  <div className="flex items-center gap-2">
                    <Clock size={14} style={{ color: C.terra }} />
                    <span style={{ fontFamily: "Inter, sans-serif", color: C.grayLight, fontSize: 13 }}>{item.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} style={{ color: C.terra }} />
                    <span style={{ fontFamily: "Inter, sans-serif", color: C.grayLight, fontSize: 13 }}>{item.mode}</span>
                  </div>
                </div>
              </motion.div>
            </FadeRise>
          ))}
        </div>
      </div>
    </section>
  )
}

function PrimeraCita() {
  const pasos = [
    { n: "01", title: "Me escribes", desc: "Envíame un mensaje por WhatsApp cuando te sientas listo/a. Sin compromiso." },
    { n: "02", title: "Agendamos", desc: "Buscamos juntos el horario que mejor se adapte a tu día a día." },
    { n: "03", title: "Conversamos", desc: "En la primera sesión me cuentas lo que estás viviendo, sin presiones." },
    { n: "04", title: "Diseñamos tu proceso", desc: "Definimos juntos un plan adaptado a tus necesidades y objetivos." },
  ]

  return (
    <section id="primera-cita" className="py-20 px-6" style={{ backgroundColor: C.cream, scrollMarginTop: 140 }}>
      <div className="max-w-6xl mx-auto">
        <FadeRise>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4"
            style={{ fontFamily: "Playfair Display, serif", color: C.sageDark }}>
            ¿Cómo es la primera cita?
          </h2>
          <p className="text-center mb-16 max-w-xl mx-auto"
            style={{ fontFamily: "Inter, sans-serif", color: C.grayLight }}>
            Dar el primer paso es lo más difícil. Aquí te explico cómo funciona.
          </p>
        </FadeRise>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pasos.map((paso, i) => (
            <FadeRise key={i} delay={i * 0.1}>
              <div className="text-center p-6 rounded-2xl" style={{ backgroundColor: C.white }}>
                <div className="text-4xl font-bold mb-4 opacity-20"
                  style={{ fontFamily: "Playfair Display, serif", color: C.sage }}>
                  {paso.n}
                </div>
                <h3 className="font-semibold text-lg mb-2"
                  style={{ fontFamily: "Playfair Display, serif", color: C.sageDark }}>
                  {paso.title}
                </h3>
                <p style={{ fontFamily: "Inter, sans-serif", color: C.gray, fontSize: 14, lineHeight: 1.6 }}>
                  {paso.desc}
                </p>
              </div>
            </FadeRise>
          ))}
        </div>
      </div>
    </section>
  )
}

function Resenas() {
  const reviews = [
    { text: "Encontré en este espacio la tranquilidad que tanto buscaba. El proceso fue gradual pero muy efectivo.", author: "Paciente anónimo/a, 34 años" },
    { text: "Por primera vez sentí que alguien realmente me escuchaba sin juzgarme. Eso cambió todo para mí.", author: "Paciente anónimo/a, 28 años" },
    { text: "Mi relación de pareja mejoró muchísimo. Aprendimos a comunicarnos de una manera completamente distinta.", author: "Paciente anónimo/a, 41 años" },
  ]

  return (
    <section id="resenas" className="py-20 px-6" style={{ backgroundColor: C.white, scrollMarginTop: 140 }}>
      <div className="max-w-6xl mx-auto">
        <FadeRise>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12"
            style={{ fontFamily: "Playfair Display, serif", color: C.sageDark }}>
            Lo que dicen quienes han dado el paso
          </h2>
        </FadeRise>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <FadeRise key={i} delay={i * 0.12}>
              <div className="p-6 rounded-2xl" style={{ backgroundColor: C.cream }}>
                <p className="mb-4 italic" style={{ fontFamily: "Playfair Display, serif", color: C.gray, lineHeight: 1.7 }}>
                  "{r.text}"
                </p>
                <p style={{ fontFamily: "Inter, sans-serif", color: C.grayLight, fontSize: 13 }}>
                  — {r.author}
                </p>
              </div>
            </FadeRise>
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
    <section id="contacto" className="py-20 px-6" style={{ backgroundColor: C.sageDark, scrollMarginTop: 140 }}>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
        <FadeRise>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white"
            style={{ fontFamily: "Playfair Display, serif" }}>
            Da el primer paso hoy
          </h2>
          <p className="mb-8 text-white/70" style={{ fontFamily: "Inter, sans-serif", lineHeight: 1.7 }}>
            No tienes que atravesar esto solo/a. Estoy aquí para acompañarte.
          </p>

          <div className="space-y-4 mb-8">
            {[
              { icon: Phone, text: "+52 (123) 456-7890" },
              { icon: MapPin, text: "Xalapa, Veracruz, México" },
              { icon: Clock, text: "Lunes a Viernes · 9:00 – 19:00" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <item.icon size={18} className="text-white/60" />
                <span className="text-white/80" style={{ fontFamily: "Inter, sans-serif", fontSize: 14 }}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>

          <a href="https://wa.me/521234567890?text=Hola, me gustaría agendar una primera cita"
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium text-sm transition-all duration-200 hover:opacity-90"
            style={{ backgroundColor: C.terra, color: "white", fontFamily: "Inter, sans-serif" }}>
            <MessageCircle size={18} />
            Escribir por WhatsApp
          </a>
        </FadeRise>

        <FadeRise delay={0.15}>
          <AnimatePresence mode="wait">
            {form.status === "success" ? (
              <DemoConfirmation
                key="confirmation"
                onReset={() => form.reset(true)}
                onClose={() => form.reset(false)}
                accentColor={C.sage}
                borderColor="rgba(255,255,255,0.25)"
                fontFamily="Inter, sans-serif"
                radius={12}
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
                  <label className="block text-white/70 text-sm mb-1" style={{ fontFamily: "Inter, sans-serif" }}>
                    Nombre
                  </label>
                  <input type="text" placeholder="Tu nombre" ref={nombreRef}
                    value={form.values.nombre} onChange={form.handleChange("nombre")}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/40 border focus:outline-none transition-colors"
                    style={{ fontFamily: "Inter, sans-serif", fontSize: 14, borderColor: form.errors.nombre ? "#F87171" : "rgba(255,255,255,0.2)" }} />
                  {form.errors.nombre && <p className="mt-1 text-xs" style={{ color: "#FCA5A5", fontFamily: "Inter, sans-serif" }}>{form.errors.nombre}</p>}
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-1" style={{ fontFamily: "Inter, sans-serif" }}>
                    Correo
                  </label>
                  <input type="email" placeholder="tu@correo.com"
                    value={form.values.correo} onChange={form.handleChange("correo")}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/40 border focus:outline-none transition-colors"
                    style={{ fontFamily: "Inter, sans-serif", fontSize: 14, borderColor: form.errors.correo ? "#F87171" : "rgba(255,255,255,0.2)" }} />
                  {form.errors.correo && <p className="mt-1 text-xs" style={{ color: "#FCA5A5", fontFamily: "Inter, sans-serif" }}>{form.errors.correo}</p>}
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-1" style={{ fontFamily: "Inter, sans-serif" }}>
                    Motivo de consulta
                  </label>
                  <select value={form.values.motivo} onChange={form.handleChange("motivo")}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border focus:outline-none transition-colors"
                    style={{ fontFamily: "Inter, sans-serif", fontSize: 14, borderColor: form.errors.motivo ? "#F87171" : "rgba(255,255,255,0.2)" }}>
                    <option value="" className="bg-gray-800">Selecciona una opción</option>
                    {["Ansiedad o estrés", "Depresión", "Terapia de pareja", "Duelo", "Otro"].map(o => (
                      <option key={o} value={o} className="bg-gray-800">{o}</option>
                    ))}
                  </select>
                  {form.errors.motivo && <p className="mt-1 text-xs" style={{ color: "#FCA5A5", fontFamily: "Inter, sans-serif" }}>{form.errors.motivo}</p>}
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-1" style={{ fontFamily: "Inter, sans-serif" }}>
                    Mensaje
                  </label>
                  <textarea rows={4} placeholder="Cuéntame brevemente qué te trae por aquí..."
                    value={form.values.mensaje} onChange={form.handleChange("mensaje")}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/40 border focus:outline-none transition-colors resize-none"
                    style={{ fontFamily: "Inter, sans-serif", fontSize: 14, borderColor: form.errors.mensaje ? "#F87171" : "rgba(255,255,255,0.2)" }} />
                  {form.errors.mensaje && <p className="mt-1 text-xs" style={{ color: "#FCA5A5", fontFamily: "Inter, sans-serif" }}>{form.errors.mensaje}</p>}
                </div>
                <motion.button
                  type="submit"
                  disabled={form.status === "submitting"}
                  whileHover={{ scale: form.status === "submitting" ? 1 : 1.02 }}
                  whileTap={{ scale: form.status === "submitting" ? 1 : 0.98 }}
                  className="w-full py-3 rounded-xl font-medium text-sm transition-all disabled:opacity-70"
                  style={{ backgroundColor: C.sage, color: "white", fontFamily: "Inter, sans-serif" }}>
                  {form.status === "submitting" ? "Enviando..." : "Enviar mensaje"}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </FadeRise>
      </div>
    </section>
  )
}

function Footer() {
  const [privacyOpen, setPrivacyOpen] = useState(false)

  return (
    <footer className="py-8 px-6 text-center" style={{ backgroundColor: "#2A3D2F" }}>
      <p style={{ fontFamily: "Inter, sans-serif", color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
        © 2026 Dra. Valeria Romero · Psicóloga Clínica · Xalapa, Veracruz
      </p>
      <p className="mt-1" style={{ fontFamily: "Inter, sans-serif", fontSize: 11 }}>
        <button onClick={() => setPrivacyOpen(true)}
          className="underline-offset-2 hover:underline transition-all"
          style={{ color: "rgba(255,255,255,0.4)", fontFamily: "Inter, sans-serif" }}>
          Aviso de privacidad
        </button>
        <span style={{ color: "rgba(255,255,255,0.2)" }}> · Todos los derechos reservados</span>
      </p>

      <PrivacyModal
        isOpen={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
        accentColor={C.sage}
        fontFamily="Inter, sans-serif"
        radius={16}
      />
    </footer>
  )
}

function WhatsAppFloat() {
  return (
    <motion.a
      href="https://wa.me/521234567890?text=Hola, me gustaría agendar una cita"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
      style={{ backgroundColor: "#25D366" }}
      animate={{ scale: [1, 1.08, 1] }}
      transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
      whileHover={{ scale: 1.15 }}
    >
      <MessageCircle size={26} color="white" />
    </motion.a>
  )
}

export default function ThemeCalido() {
  useFonts()
  return (
    <div style={{ backgroundColor: C.cream }}>
      <Navbar />
      <Hero />
      <Identificacion />
      <SobreMi />
      <Servicios />
      <PrimeraCita />
      <Resenas />
      <Contacto />
      <Footer />
      <WhatsAppFloat />
    </div>
  )
}