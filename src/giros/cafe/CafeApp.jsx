import { useEffect, useState } from "react"
import { Link, NavLink, Navigate, Route, Routes, useLocation } from "react-router-dom"
import DemoBanner from "../../components/shared/DemoBanner"
import ComercialCTA from "../../components/shared/ComercialCTA"
import WhatsAppPreview from "../../components/shared/WhatsAppPreview"
import WaterMark from "../../components/WaterMark"
import useFavicon from "../../hooks/useFavicon"
import usePageMetadata from "../../hooks/usePageMetadata"
import Inicio from "./pages/Inicio"
import "./cafe.css"

const PAGES = [["/cafe", "Inicio"]]

function CafeGuide() {
  return (
    <div className="space-y-4 text-sm leading-relaxed text-slate-300">
      <p>
        Ladera es un café de especialidad ficticio con un solo local en Xalapa. Cada lote se
        presenta como una ficha: productor, finca, altitud, proceso, notas de taza y lo que se pagó
        por él.
      </p>
      <ul className="list-disc pl-5 space-y-3">
        <li>
          Productores, fincas, puntajes, precios y horarios son de ejemplo. Los municipios son
          reales y el parque es una referencia geográfica, no un establecimiento.
        </li>
        <li>
          Las curvas de nivel son ilustrativas: muestran una línea cada 50 metros hasta la altitud
          del lote, no el terreno real de una finca.
        </li>
        <li>WhatsApp abre una conversación simulada; no se envía ningún mensaje.</li>
      </ul>
      <p>“Contactar” y “Hablemos” abren los canales reales de Ian para consultar un proyecto.</p>
    </div>
  )
}

export default function CafeApp() {
  useFavicon("/favicons/cafe.svg")
  const { pathname } = useLocation()
  const [whatsapp, setWhatsapp] = useState(false)
  const page = PAGES.find(([to]) => to === pathname.replace(/\/+$/, ""))
  usePageMetadata(
    `${page ? page[1] : "Página no encontrada"} — Ladera, café de altura · Demo de Ian Aldana Martínez`,
    "Café de especialidad ficticio en Xalapa: lotes de altura con productor, proceso y precio publicados. Portafolio de Ian Aldana Martínez.",
  )
  useEffect(() => {
    if (!document.querySelector("dialog[open]"))
      document.querySelector("#contenido h1")?.focus({ preventScroll: true })
  }, [pathname])
  return (
    <div className="ladera-root">
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <DemoBanner guide={<CafeGuide />} />
      <header className="l-header">
        <Link className="l-brand" to="/cafe" aria-label="Ladera, inicio">
          <svg viewBox="0 0 32 20" aria-hidden="true">
            <path d="M1 19 C8 15 11 6 16 4 C21 6 24 15 31 19" />
            <path d="M8 19 C12 16 14 11 16 10 C18 11 20 16 24 19" />
          </svg>
          <span>ladera</span>
        </Link>
        <nav aria-label="Navegación de la demo">
          {PAGES.map(([to, label]) => (
            <NavLink key={to} to={to} end>
              {label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main id="contenido" tabIndex={-1}>
        <Routes>
          <Route index element={<Inicio onWhatsApp={() => setWhatsapp(true)} />} />
          <Route path="*" element={<Navigate to="/cafe" replace />} />
        </Routes>
      </main>
      <ComercialCTA
        giro="cafetería"
        accentColor="#F8F8F5"
        backgroundColor="#1C1B19"
        textColor="#F8F8F5"
        fontFamily="Ladera Serif, Georgia, serif"
        headingFontFamily="Ladera Sans, sans-serif"
        radius={2}
      />
      <footer className="l-footer">
        <p>Ladera · café de altura. Negocio ficticio creado para una demostración de portafolio.</p>
      </footer>
      <WaterMark />
      <WhatsAppPreview
        isOpen={whatsapp}
        onClose={() => setWhatsapp(false)}
        businessName="Ladera"
        fontFamily="Ladera Serif, Georgia, serif"
        radius={2}
        messages={[
          "Hola, ¿qué lote tienen hoy en filtrado?",
          "Hola, ¿venden el café en grano molido para prensa francesa?",
          "Hola, ¿a qué hora abren el domingo?",
        ]}
        autoReply="¡Hola! Hoy tenemos El Encino de Coatepec en espresso y filtrado. Esta respuesta es de ejemplo; no se envió ningún mensaje."
      />
    </div>
  )
}
