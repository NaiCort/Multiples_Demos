import { useEffect, useRef, useState } from "react"
import { Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { MapPin, Menu as MenuIcon, ShoppingBag, UtensilsCrossed, X, CheckCircle2 } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import DemoBanner from "../../components/shared/DemoBanner"
import Modal from "../../components/shared/Modal"
import ComercialCTA from "../../components/shared/ComercialCTA"
import WaterMark from "../../components/WaterMark"
import WhatsAppPreview from "../../components/shared/WhatsAppPreview"
import useFavicon from "../../hooks/useFavicon"
import usePageMetadata from "../../hooks/usePageMetadata"
import { findProduct, MODES } from "./data/order"
import { availableAt, menuForPoint } from "./data/menu"
import { DEFAULT_POINT, POINTS, findPoint, localLabel, parseEntry } from "./data/locations"
import { canOrder, createVisit } from "./state/model"
import { useRestaurant } from "./state/context"
import Inicio from "./pages/Inicio"
import Carta from "./pages/Carta"
import Locales from "./pages/Locales"
import LocalDetalle from "./pages/LocalDetalle"
import Conocenos from "./pages/Conocenos"
import ServiceChoice from "./components/ServiceChoice"
import LocalPicker from "./components/LocalPicker"
import ItemPicker from "./components/ItemPicker"
import OrderFlow from "./components/OrderFlow"
import TrackingPanel from "./components/TrackingPanel"
import ProfilePanel from "./components/ProfilePanel"
import TableReservation from "./components/TableReservation"
import EntryPanel from "./components/EntryPanel"
import "./restaurante.css"

const LINKS = [["/restaurante", "Inicio"], ["/restaurante/carta", "La carta"], ["/restaurante/locales", "Locales"], ["/restaurante/conocenos", "Conócenos"]]
function RestaurantGuide() {
  return <div className="space-y-4 text-sm leading-relaxed text-slate-300">
    <p>Patio 12 es un restaurante ficticio. Inicio presenta la marca; La carta reúne {menuForPoint(DEFAULT_POINT).length} opciones por local, organizadas por categorías; Locales muestra el mapa y {POINTS.length} fichas en México y Estados Unidos; Conócenos presenta el concepto y un equipo de ejemplo.</p>
    <ul className="list-disc pl-5 space-y-3"><li>Una visita nueva comienza en CDMX–Chapultepec. Puedes cambiar el local simulado; el carrito se conserva. «Sabores de la región» ofrece una receta diferente en cada local. Si llevas una especialidad de otro local, debes quitarla o volver a su local antes de confirmar. Los parques son referencias geográficas, nunca establecimientos reales.</li><li>Elige comer aquí, para llevar o a domicilio desde Inicio. También puedes explorar la carta antes de elegir. El QR de mesa representa a alguien ya sentado y evita la espera normal.</li><li>Personaliza platos, bebidas y combos. Ingredientes, nutrientes, alérgenos, precios y horarios son ficticios. Los precios de ejemplo son MXN incluso en los locales de Estados Unidos.</li><li>Pedido y Seguimiento tienen sus propias páginas. El mismo pedido, contador y perfil se conservan al navegar o recargar; la visita caduca a las seis horas.</li><li>El mapa y la ubicación son opcionales. Los QR contienen únicamente punto y mesa; no comparten pedidos entre dispositivos.</li></ul>
    <p>Las otras identidades del giro Restaurante se desarrollarán después. “Contactar” y “Hablemos” abren los canales reales de Ian para consultar un proyecto.</p>
  </div>
}
export default function RestauranteApp() {
  useFavicon("/favicons/restaurante.svg")
  const { state, dispatch, cartDispatch, storageAvailable } = useRestaurant()
  const { cart, visit, order } = state
  const location = useLocation(), navigate = useNavigate()
  const pathname = location.pathname.replace(/\/+$/, "")
  const [params] = useSearchParams()
  const reduced = useReducedMotion()
  const [panel, setPanel] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [product, setProduct] = useState(null)
  const [editing, setEditing] = useState(null)
  const [pendingItem, setPendingItem] = useState(null)
  const [localIntent, setLocalIntent] = useState(null)
  const [reservationPointId, setReservationPointId] = useState(state.pointId)
  const [notice, setNotice] = useState(null)
  const [cartFeedback, setCartFeedback] = useState(0)
  const notify = (message, kind = "info") => setNotice(previous => ({ message, kind, id: (previous?.id || 0) + 1 }))
  const cartButton = useRef(null), lastCarta = useRef("/restaurante/carta")
  const entry = parseEntry(params)
  const locked = !!order && order.status !== "completed"
  const count = cart.reduce((sum, row) => sum + row.quantity, 0)
  const titles = { "/restaurante": "Inicio", "/restaurante/carta": "La carta", "/restaurante/locales": "Locales", "/restaurante/conocenos": "Conócenos", "/restaurante/pedido": "Tu pedido", "/restaurante/seguimiento": "Seguimiento" }
  const detail = findPoint(pathname.split("/").at(-1))
  const title = titles[pathname] || (detail ? localLabel(detail.id) : "Página no encontrada")
  usePageMetadata(`${title} — Patio 12 · Demo de Ian Aldana Martínez`, "Restaurante ficticio: carta configurable, locales simulados, reservas y pedidos de demostración. Portafolio de Ian Aldana Martínez.")
  useEffect(() => {
    if (pathname === "/restaurante/carta") lastCarta.current = pathname + location.search
  }, [pathname, location.search])
  useEffect(() => {
    if (!document.querySelector("dialog[open]")) document.querySelector("#contenido h1")?.focus({ preventScroll: true })
  }, [location.pathname])
  const follow = () => { setPanel(null); navigate("/restaurante/seguimiento") }
  const close = () => { setPanel(null); setPendingItem(null) }
  const goToMenu = () => { close(); if (visit?.stage === "seated") dispatch({ type: "acknowledge" }); navigate(lastCarta.current) }
  const choose = (item, row = null) => {
    setProduct(item); setEditing(row)
    if (!visit && (!order || order.status === "completed")) { setPendingItem({ item, row }); setPanel("mode") }
    else setPanel("product")
  }
  const afterMode = mode => {
    if (!mode) { close(); return }
    if (pendingItem) { setProduct(pendingItem.item); setEditing(pendingItem.row); setPendingItem(null); setPanel("product") }
    else { setPanel(null); navigate(mode === "dine" ? "/restaurante/seguimiento" : lastCarta.current) }
  }
  const startMode = mode => {
    if (locked) { notify(`Tu pedido confirmado está en ${localLabel(order.pointId)}. Finaliza ese recorrido para empezar otro.`); follow(); return }
    if (visit?.mode !== mode) dispatch({ type: "start", visit: createVisit(mode, visit?.people || 2, undefined, state.pointId) })
    navigate(mode === "dine" ? "/restaurante/seguimiento" : lastCarta.current)
  }
  const reserve = id => { setReservationPointId(typeof id === "string" ? id : state.pointId); setPanel("reservation") }
  const localAction = (id, intent = "select") => {
    if (intent === "reserve") { reserve(id); return }
    if (locked) { notify(`Tu pedido confirmado conserva ${localLabel(order.pointId)}. Termina ese recorrido antes de pedir en otro local.`); follow(); return }
    if (visit?.mode === "dine" && id !== state.pointId) { setLocalIntent({ id, intent }); setPanel("local"); return }
    dispatch({ type: "point", pointId: id })
    if (intent === "order") setPanel("mode")
    else notify(`Local seleccionado: ${localLabel(id)}.`)
  }
  const add = action => {
    if (!availableAt(findProduct(action.productId), state.pointId)) { notify("Esta especialidad pertenece a otro local. Revisa el local de tu carta."); return }
    cartDispatch(action); setCartFeedback(value => value + 1); notify(`${product.name}: ${editing ? "cambios guardados" : "añadido al pedido"}.`, "success"); close()
    requestAnimationFrame(() => cartButton.current?.focus({ preventScroll: true }))
  }
  const navLinks = () => LINKS.map(([to, label]) => <NavLink key={to} to={to} end={to === "/restaurante"} onClick={() => setMenuOpen(false)}>{label}</NavLink>)
  const legacyTracking = params.has("seguimiento") && !entry
  const isTransaction = ["/restaurante/pedido", "/restaurante/seguimiento"].includes(pathname)
  return <div className="restaurant-root">
    <a className="skip-link" href="#contenido">Saltar al contenido</a>
    <DemoBanner guide={<RestaurantGuide />} />
    <nav className="r-nav" aria-label="Navegación de la demo">
      <Link className="r-brand" to="/restaurante" aria-label="Patio 12, inicio"><UtensilsCrossed size={23} aria-hidden="true" /><span>patio <strong>12</strong><small>cocina de barrio</small></span></Link>
      <div className="r-desktop-nav">{navLinks()}<button type="button" className="r-nav-reserve" onClick={() => reserve()}>Reservar mesa</button></div>
      <div className="r-nav-actions"><button type="button" ref={cartButton} className="r-cart-button" aria-label={`Ver pedido, ${count} productos`} onClick={() => navigate("/restaurante/pedido")}><ShoppingBag size={19} aria-hidden="true" /><span className="r-cart-label">Pedido</span><span key={cartFeedback} className={`r-cart-count${cartFeedback ? " r-cart-updated" : ""}`} aria-hidden="true">{count}</span></button><button type="button" aria-label="Abrir menú" aria-haspopup="dialog" className="r-mobile-menu" onClick={() => setMenuOpen(true)}><MenuIcon size={23} aria-hidden="true" /></button></div>
    </nav>
    <div className="r-service-bar"><span className="r-active-local"><MapPin size={15} aria-hidden="true" /><span><small>Local simulado</small><strong>{localLabel(locked ? order.pointId : state.pointId)}</strong></span><button type="button" className="r-text-button" onClick={() => { setLocalIntent(null); setPanel("local") }}>Cambiar local</button></span><div><span className="r-mode-label">{visit ? `${MODES[visit.mode]}${visit.table ? ` · Mesa ${visit.table}` : visit.stage === "waiting" ? " · Esperando mesa" : ""}` : "Elige tu plan"}</span><button type="button" className="r-text-button" onClick={() => { setPendingItem(null); setPanel("mode") }}>Cambiar modalidad</button><button type="button" className="r-text-button" onClick={() => setPanel("profile")}>Mi perfil · demo</button>{(visit || order) && <Link className="r-text-button" to="/restaurante/seguimiento">Mi seguimiento</Link>}</div></div>
    {!storageAvailable && <p className="r-storage-note" role="status">El navegador no permite guardar esta prueba. Funcionará durante esta página; al recargar comenzará otra visita.</p>}
    {visit?.stage === "seated" && !visit.acknowledged && !order && pathname !== "/restaurante/seguimiento" && <motion.div className="r-table-alert" initial={reduced ? false : { opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} role="status"><UtensilsCrossed size={23} aria-hidden="true" /><span>Tu mesa {visit.table} ya te espera en {localLabel(visit.pointId)}.</span><Link className="r-text-button" to="/restaurante/seguimiento">Ver mi mesa</Link><button type="button" className="r-text-button" onClick={() => dispatch({ type: "acknowledge" })}>Entendido</button></motion.div>}
    <main id="contenido" tabIndex={-1}>
      <div key={pathname} className="r-page-content">
      <Routes>
        <Route index element={legacyTracking ? <Navigate to="/restaurante/seguimiento" replace /> : <Inicio onChoose={choose} onMode={startMode} onReserve={reserve} onLocalOrder={id => localAction(id, "order")} onLocalReserve={reserve} />} />
        <Route path="carta" element={<Carta onChoose={choose} onChangeLocal={() => setPanel("local")} />} />
        <Route path="locales" element={<Locales onLocalOrder={id => localAction(id, "order")} onLocalReserve={reserve} />} />
        <Route path="locales/:pointId" element={<LocalDetalle onLocalOrder={id => localAction(id, "order")} onLocalReserve={reserve} onSelectLocal={id => localAction(id)} />} />
        <Route path="conocenos" element={<Conocenos />} />
        <Route path="pedido" element={<OrderFlow embedded onMenu={goToMenu} onTracking={follow} onMode={() => setPanel("mode")} onProfile={() => setPanel("profile")} onChangeLocal={() => setPanel("local")} onEdit={row => choose(findProduct(row.productId), row)} />} />
        <Route path="seguimiento" element={<TrackingPanel embedded onMenu={goToMenu} onProfile={() => setPanel("profile")} />} />
        <Route path="*" element={<section className="r-page-section"><h1 tabIndex={-1}>Esta página no está<br />en el patio.</h1><p className="r-section-intro">Puedes volver a Inicio o seguir explorando la carta. Tu visita se conserva.</p><Link className="r-button" to="/restaurante">Volver a Inicio</Link></section>} />
      </Routes>
      </div>
      {!isTransaction && <ComercialCTA giro="restaurante" accentColor="#edd068" backgroundColor="#203b2e" textColor="#ffffff" fontFamily="Patio Sans, sans-serif" headingFontFamily="Patio Bitter, serif" radius={4} />}
      <footer className="r-footer"><Link to="/restaurante">patio <strong>12</strong></Link><p>Restaurante, locales y equipo ficticios · Prototipo de Ian Aldana Martínez</p><div className="r-footer-links"><a className="r-text-button" href="/restaurante/creditos-fotos.html">Créditos de las fotos</a><button type="button" className="r-text-button" onClick={() => setPanel("whatsapp")}>WhatsApp · demo</button><button type="button" className="r-text-button" onClick={() => setPanel("privacy")}>Privacidad de la demo</button></div></footer>
    </main>
    <div className="r-announcement" role="status" aria-live="polite" aria-atomic="true">{notice && <div key={notice.id} className={`r-notice-card r-notice-${notice.kind}`}>{notice.kind === "success" && <CheckCircle2 size={22} aria-hidden="true" />}<span>{notice.message}</span><button type="button" aria-label="Ocultar aviso del pedido" onClick={() => setNotice(null)}><X size={16} aria-hidden="true" /></button></div>}</div>
    <WaterMark />
    {menuOpen && <Modal title="Menú del restaurante" onClose={() => setMenuOpen(false)} className="restaurant-modal" radius={4}><div className="r-mobile-links">{navLinks()}<button type="button" className="r-button" onClick={() => { setMenuOpen(false); reserve() }}>Reservar mesa</button></div></Modal>}
    {panel === "product" && <ItemPicker key={editing?.key || product.id} product={product} cart={cart} editing={editing} allowed={canOrder(state) && availableAt(product, state.pointId)} blockedReason={order ? "Tu pedido ya está confirmado. Termina su recorrido antes de añadir otro plato." : !availableAt(product, state.pointId) ? "Esta especialidad pertenece a otro local. Puedes revisar el carrito para quitarla o volver a su local." : null} onWait={!availableAt(product, state.pointId) ? () => { close(); navigate("/restaurante/pedido") } : follow} onAdd={add} onClose={close} />}
    {panel === "mode" && <ServiceChoice onClose={afterMode} onReservation={() => reserve()} />}
    {panel === "profile" && <ProfilePanel onClose={close} onReset={() => { dispatch({ type: "reset" }); close(); setNotice(null); navigate("/restaurante") }} />}
    {panel === "reservation" && <TableReservation key={reservationPointId} pointId={reservationPointId} onClose={close} onChangeLocal={() => { setLocalIntent({ id: reservationPointId, intent: "reserve" }); setPanel("local") }} />}
    {panel === "local" && <LocalPicker initialId={localIntent?.id} independent={localIntent?.intent === "reserve"} onClose={() => { if (localIntent?.intent === "reserve") setPanel("reservation"); else close(); setLocalIntent(null) }} onSelected={id => { if (localIntent?.intent === "reserve") { setReservationPointId(id); setPanel("reservation") } else if (localIntent?.intent === "order") setPanel("mode"); else { setPanel(null); notify(`Local seleccionado: ${localLabel(id)}.`) } setLocalIntent(null) }} />}
    {entry && <EntryPanel entry={entry} onClose={() => navigate(location.pathname, { replace: true })} onStart={seated => { navigate(seated ? "/restaurante/seguimiento" : "/restaurante", { replace: true }); setPanel(seated ? null : "mode") }} />}
    <WhatsAppPreview isOpen={panel === "whatsapp"} onClose={close} businessName="Patio 12" fontFamily="Patio Sans, sans-serif" radius={4} messages={["Hola, ¿cómo puedo reservar una mesa?", "Hola, ¿puedo pedir para recoger?", "Hola, ¿qué opciones vegetarianas tienen?"]} autoReply="¡Hola! Explora La carta y Locales para preparar tu visita. Puedes probar una reserva o un pedido. Esta respuesta es de ejemplo." />
    {panel === "privacy" && <Modal title="Privacidad de la demo de restaurante" onClose={close} className="restaurant-modal" radius={4}><div className="r-privacy"><p>Utiliza solamente datos ficticios. El punto elegido, la visita, el carrito y el pedido activo se guardan en el almacenamiento local de este navegador, junto con la posición del contador. Se recuperan al volver o recargar, y la visita caduca a las seis horas de su inicio.</p><p>Si activas el perfil de ejemplo, este conserva hasta diez recibos y su contador de visitas. No es una cuenta autenticada ni se comparte entre dispositivos. Un invitado deja de conservar su pedido al finalizar la sesión. “Reiniciar datos de la demo”, en Mi perfil, borra estos datos del restaurante.</p><p>No se solicitan tarjetas, contraseñas ni datos fiscales. No se realizan pagos, correos, pedidos o reservas reales. La reserva futura y WhatsApp permanecen en memoria y se descartan al cerrar su ventana. Fotos y fuentes del restaurante se sirven localmente. Al pulsar “Mostrar mapa interactivo”, se consulta la cartografía de OpenFreeMap/OpenStreetMap; esos proveedores reciben las solicitudes e información técnica de conexión. Sin abrir el mapa no se solicitan sus teselas. El alojamiento recibe las solicitudes necesarias para cargar la página.</p><p>La ventana flotante de escritorio es opcional y depende del navegador. Termina al cerrar la pestaña; no se pide acceso a notificaciones. “Usar mi ubicación” solicita opcionalmente la geolocalización del navegador para encontrar la referencia más cercana. Se usa en memoria y no se guarda ni se envía al mapa; el dispositivo o navegador puede usar sus propios servicios de ubicación. Si no la autorizas, la lista manual sigue disponible.</p><p>Los QR contienen únicamente el punto y, si se elige, la mesa ficticia. No comparten pedidos o perfiles entre dispositivos. Las rutas y coberturas son preparadas e ilustrativas; no se consultan domicilios ni tráfico.</p><p>La portada y Psicólogo conservan su propio comportamiento: pueden utilizar Google Fonts, Unsplash y almacenamiento local de preferencias. Sus avisos describen esas funciones.</p><p>“Contactar” y “Hablemos” abren los canales reales de Ian. Se aplican las condiciones del proveedor que elijas. Este texto explica un prototipo; un negocio real necesitará su propio aviso.</p></div><button type="button" className="r-button r-full" onClick={close}>Entendido</button></Modal>}
  </div>
}
