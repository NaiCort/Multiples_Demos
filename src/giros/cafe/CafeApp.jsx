import { useEffect, useReducer, useState } from "react"
import { Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom"
import { ShoppingBag } from "lucide-react"
import DemoBanner from "../../components/shared/DemoBanner"
import ComercialCTA from "../../components/shared/ComercialCTA"
import WhatsAppPreview from "../../components/shared/WhatsAppPreview"
import WaterMark from "../../components/WaterMark"
import useFavicon from "../../hooks/useFavicon"
import usePageMetadata from "../../hooks/usePageMetadata"
import Inicio from "./pages/Inicio"
import Carta from "./pages/Carta"
import Pedido from "./pages/Pedido"
import Origen from "./pages/Origen"
import Prepara from "./pages/Prepara"
import Visitanos from "./pages/Visitanos"
import Creditos from "./pages/Creditos"
import ItemPanel from "./components/ItemPanel"
import { findItem } from "./data/carta"
import { cartCount, load, reducer, save } from "./state/pedido"
import "./cafe.css"

const PAGES = [
  ["/cafe", "Inicio"],
  ["/cafe/carta", "La carta"],
  ["/cafe/origen", "Origen"],
  ["/cafe/prepara", "En casa"],
  ["/cafe/visitanos", "Visítanos"],
]
const TITLES = Object.fromEntries([
  ...PAGES.slice(0, 3),
  ["/cafe/prepara", "Prepara en casa"],
  ["/cafe/visitanos", "Visítanos"],
  ["/cafe/pedido", "Tu pedido"],
  ["/cafe/creditos", "Créditos"],
])
const storage = () => {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

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
          Las curvas de nivel son ilustrativas: muestran la finca vista desde arriba, con una línea
          cada 50 metros hasta la altitud del lote; los colores son un guiño al tueste, no el
          terreno real de una finca.
        </li>
        <li>
          La carta permite armar un pedido para recoger: leche, shots, azúcar y lote del filtrado.
          El pedido no se cobra ni se envía; pasa por la barra en un minuto para mostrar el
          seguimiento, y se conserva en este navegador al recargar.
        </li>
        <li>
          Prepara en casa tiene un temporizador real: cuenta el tiempo y marca cada vertido de la
          receta elegida. Las recetas son orientativas.
        </li>
        <li>
          Visítanos incluye una tarjeta de visitas (cada pedido recogido suma un sello) y la reserva
          de una cata los sábados. Ambas son simuladas y se guardan en este navegador.
        </li>
        <li>WhatsApp abre una conversación simulada; no se envía ningún mensaje.</li>
      </ul>
      <p>“Contactar” y “Hablemos” abren los canales reales de Ian para consultar un proyecto.</p>
    </div>
  )
}

export default function CafeApp() {
  useFavicon("/favicons/cafe.svg")
  const { pathname, hash } = useLocation()
  const navigate = useNavigate()
  const [whatsapp, setWhatsapp] = useState(false)
  const [state, dispatch] = useReducer(reducer, undefined, () => load(storage()))
  const [choosing, setChoosing] = useState(null)
  const [notice, setNotice] = useState(null)
  useEffect(() => {
    save(storage(), state)
  }, [state])
  useEffect(() => {
    if (!notice) return undefined
    const timer = setTimeout(() => setNotice(null), 6000)
    return () => clearTimeout(timer)
  }, [notice])
  const active = state.order && state.order.status !== "recogido"
  const count = cartCount(state.cart)
  const choose = (item, initialConfig) => {
    if (active) {
      setNotice({
        id: Date.now(),
        text: "Ya tienes un pedido en la barra. Recógelo antes de empezar otro.",
      })
      return
    }
    setChoosing({ item, initialConfig })
  }
  const add = (line) => {
    dispatch({ type: "add", ...line })
    setChoosing(null)
    setNotice({
      id: Date.now(),
      text: `${findItem(line.itemId).nombre} agregado a tu pedido.`,
      link: true,
    })
  }
  const title = TITLES[pathname.replace(/\/+$/, "")]
  usePageMetadata(
    `${title || "Página no encontrada"} — Ladera, café de altura · Demo de Ian Aldana Martínez`,
    "Café de especialidad ficticio en Xalapa: lotes de altura con productor, proceso y precio publicados. Portafolio de Ian Aldana Martínez.",
  )
  useEffect(() => {
    if (document.querySelector("dialog[open]")) return
    const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null
    if (target) {
      target.scrollIntoView({ block: "start" })
      const heading = target.querySelector("h2, h3")
      heading?.setAttribute("tabindex", "-1")
      heading?.focus({ preventScroll: true })
    } else document.querySelector("#contenido h1")?.focus({ preventScroll: true })
  }, [pathname, hash])
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
        <button
          type="button"
          className="l-cart"
          aria-label={active ? "Ver el estado de tu pedido" : `Ver pedido, ${count} productos`}
          onClick={() => navigate("/cafe/pedido")}
        >
          <ShoppingBag size={18} aria-hidden="true" />
          <span className="l-cart-label">{active ? "En barra" : "Pedido"}</span>
          {!active && <span className="l-cart-count l-num">{count}</span>}
        </button>
      </header>
      <main id="contenido" tabIndex={-1}>
        <Routes>
          <Route index element={<Inicio onWhatsApp={() => setWhatsapp(true)} />} />
          <Route path="carta" element={<Carta onChoose={choose} />} />
          <Route path="pedido" element={<Pedido state={state} dispatch={dispatch} />} />
          <Route path="origen" element={<Origen onChoose={choose} />} />
          <Route path="prepara" element={<Prepara onChoose={choose} />} />
          <Route path="creditos" element={<Creditos />} />
          <Route
            path="visitanos"
            element={
              <Visitanos
                visitas={state.visitas || 0}
                onWhatsApp={() => setWhatsapp(true)}
                onCanjear={() => {
                  dispatch({ type: "canjear" })
                  setNotice({
                    id: Date.now(),
                    text: "Bebida de cortesía canjeada. Es una simulación: no hay bebida real.",
                  })
                }}
              />
            }
          />
          <Route path="*" element={<Navigate to="/cafe" replace />} />
        </Routes>
      </main>
      <ComercialCTA
        giro="cafetería"
        accentColor="#F7F1E8"
        backgroundColor="#2A1E19"
        textColor="#F7F1E8"
        fontFamily="Ladera Serif, Georgia, serif"
        headingFontFamily="Ladera Sans, sans-serif"
        radius={2}
      />
      <footer className="l-footer">
        <p>Ladera · café de altura. Negocio ficticio creado para una demostración de portafolio.</p>
        <Link to="/cafe/creditos">Créditos de fotografías y tipografías</Link>
      </footer>
      <div className="l-toast-region" role="status" aria-live="polite">
        {notice && (
          <div key={notice.id} className="l-toast">
            <span>{notice.text}</span>
            {notice.link && pathname !== "/cafe/pedido" && (
              <Link to="/cafe/pedido" onClick={() => setNotice(null)}>
                Ver pedido
              </Link>
            )}
            <button type="button" onClick={() => setNotice(null)}>
              Cerrar aviso
            </button>
          </div>
        )}
      </div>
      {choosing && (
        <ItemPanel
          item={choosing.item}
          initialConfig={choosing.initialConfig}
          onAdd={add}
          onClose={() => setChoosing(null)}
        />
      )}
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
