import { useRef, useState } from "react"
import { ArrowDown, ArrowUpRight, Clock, MapPin, Menu as MenuIcon, Search, ShoppingBag, UtensilsCrossed, X } from "lucide-react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"
import DemoBanner from "../../components/shared/DemoBanner"
import Modal from "../../components/shared/Modal"
import ComercialCTA from "../../components/shared/ComercialCTA"
import WaterMark from "../../components/WaterMark"
import useFavicon from "../../hooks/useFavicon"
import usePageMetadata from "../../hooks/usePageMetadata"
import useRouteFocus from "../../hooks/useRouteFocus"
import useDemoNavigation from "../../hooks/useDemoNavigation"
import { CATEGORIES, DIETS, FEATURED, MENU, money, normalizeSearch } from "./data/menu"
import { dietLabel, dietaryTag, findProduct, MODES, nutrition } from "./data/order"
import { useRestaurant } from "./state/context"
import { canOrder } from "./state/model"
import PhotoGallery from "./components/PhotoGallery"
import ServiceChoice from "./components/ServiceChoice"
import TrackingPanel from "./components/TrackingPanel"
import ProfilePanel from "./components/ProfilePanel"
import ItemPicker from "./components/ItemPicker"
import OrderFlow from "./components/OrderFlow"
import TableReservation from "./components/TableReservation"
import WhatsAppPreview from "../../components/shared/WhatsAppPreview"
import LocationExplorer from "./components/LocationExplorer"
import EntryPanel from "./components/EntryPanel"
import PatioSeal from "./components/PatioSeal"
import { parseEntry, pointOrDefault } from "./data/locations"
import "./restaurante.css"

const NAV_IDS = ["inicio", "carta", "el-patio", "visitanos"]
const LINKS = [["carta", "La carta"], ["el-patio", "El patio"], ["visitanos", "Visítanos"]]
function RestaurantGuide() {
  return <div className="space-y-4 text-sm leading-relaxed text-slate-300">
    <p>Patio 12 es un restaurante ficticio. Esta primera identidad representa un restaurante de barrio; las otras identidades se desarrollarán después.</p>
    <ul className="list-disc pl-5 space-y-3"><li>Elige comer aquí, para llevar o a domicilio. Si comes aquí, espera un minuto o salta la espera de prueba; puedes explorar mientras tanto.</li><li>Cada producto tiene fotografía, ingredientes y nutrientes ficticios. Personaliza porciones, proteína, guarniciones, bebidas y combos donde estén disponibles; revisa los detalles en el recibo.</li><li>Mueve o minimiza el contador. Al volver al portafolio aparece compacto; tocarlo recupera la misma visita.</li><li>Prueba un perfil de ejemplo, beneficios y pago simulado. Los pedidos finalizados se guardan en ese perfil.</li><li>Explora ocho puntos de demostración, abre un mapa, prueba destinos ficticios o un QR de mesa. Los parques son referencias reales, nunca sucursales.</li></ul>
    <p>La visita activa, el carrito, el perfil de ejemplo y la posición del contador se guardan en este navegador. No hay pagos, correos, envíos ni mesas reales. El invitado termina su sesión al finalizar el recorrido; también caduca a las seis horas. Puedes reiniciar la prueba desde el perfil.</p>
    <p>“Contactar” y “Hablemos” son los canales reales de Ian para consultar un proyecto.</p>
  </div>
}
function Reveal({ children, className = "" }) {
  const reduced = useReducedMotion()
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.08 }} transition={{ duration: reduced ? 0 : 0.45 }}>{children}</motion.div>
}
export default function RestauranteApp() {
  useFavicon("/favicons/restaurante.svg")
  usePageMetadata("Patio 12 — Demo de restaurante por Ian Aldana Martínez", "Restaurante ficticio: carta, pedido y reserva de mesa simulados. Prototipo del portafolio de Ian Aldana Martínez.")
  useRouteFocus()
  const { activeSection, menuOpen, setMenuOpen, navigateToSection } = useDemoNavigation(NAV_IDS)
  const { state, dispatch, cartDispatch, storageAvailable } = useRestaurant()
  const { cart, visit, order } = state
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const entry = parseEntry(params)
  const point = pointOrDefault(order?.status !== "completed" && order?.pointId || visit?.pointId || state.pointId)
  const reduced = useReducedMotion()
  const trackingOpen = !!params.get("seguimiento") && [order?.id, visit?.id, order?.visitId].includes(params.get("seguimiento"))
  const [panel, setPanel] = useState(null)
  const [product, setProduct] = useState(null)
  const [editing, setEditing] = useState(null)
  const [diet, setDiet] = useState("all")
  const [category, setCategory] = useState("Todo")
  const [search, setSearch] = useState("")
  const [notice, setNotice] = useState("")
  const cartButton = useRef(null)
  const count = cart.reduce((sum, row) => sum + row.quantity, 0)
  const query = normalizeSearch(search)
  const filtered = MENU.filter(item => (category === "Todo" || item.category === category) && (diet === "all" || dietaryTag(item) === diet || diet === "vegetarian" && dietaryTag(item) === "vegan") && normalizeSearch(`${item.name} ${item.description} ${item.ingredients.map(ingredient => ingredient.name).join(" ")}`).includes(query))
  const choose = (item, row = null) => { setProduct(item); setEditing(row); setPanel("product"); if (trackingOpen) navigate("/restaurante", { replace: true }) }
  const follow = () => { setPanel(null); navigate(`/restaurante?seguimiento=${encodeURIComponent(order?.id || visit?.id || "")}`) }
  const close = () => { setPanel(null); if (trackingOpen) navigate("/restaurante", { replace: true }) }
  const goToMenu = () => {
    close()
    if (order?.status === "completed") { setPanel("mode"); return }
    if (visit?.stage === "seated") dispatch({ type: "acknowledge" })
    requestAnimationFrame(() => { const section = document.getElementById("carta"); section?.scrollIntoView({ block: "start" }); section?.querySelector("h2")?.focus({ preventScroll: true }) })
  }
  const add = action => {
    cartDispatch(action); setNotice(`${product.name}: ${editing ? "cambios guardados" : "añadido al pedido"}.`); setPanel(null)
    requestAnimationFrame(() => cartButton.current?.focus({ preventScroll: true }))
  }
  const navLinks = () => LINKS.map(([id, label]) => <a key={id} href={`#${id}`} aria-current={activeSection === id ? "location" : undefined} onClick={navigateToSection}>{label}</a>)
  return <div className="restaurant-root">
    <a className="skip-link" href="#contenido">Saltar al contenido</a>
    <DemoBanner guide={<RestaurantGuide />} />
    <nav className="r-nav" aria-label="Navegación de la demo">
      <a className="r-brand" href="#inicio" onClick={navigateToSection} aria-label="Patio 12, inicio"><UtensilsCrossed size={23} aria-hidden="true" /><span>patio <strong>12</strong><small>cocina de barrio</small></span></a>
      <div className="r-desktop-nav">{navLinks()}<button type="button" className="r-nav-reserve" onClick={() => setPanel("reservation")}>Reservar mesa <ArrowUpRight size={16} aria-hidden="true" /></button></div>
      <div className="r-nav-actions"><button type="button" ref={cartButton} className="r-cart-button" aria-label={`Ver pedido, ${count} productos`} onClick={() => setPanel("order")}><ShoppingBag size={19} aria-hidden="true" /><span className="r-cart-label">Pedido</span><span className="r-cart-count">{count}</span></button><button type="button" aria-label="Abrir menú" aria-haspopup="dialog" className="r-mobile-menu" onClick={() => setMenuOpen(true)}><MenuIcon size={23} aria-hidden="true" /></button></div>
    </nav>
    <div className="r-service-bar"><span>{visit ? `${MODES[visit.mode]}${visit.table ? ` · Mesa ${visit.table}` : visit.stage === "waiting" ? " · Esperando mesa" : ""}` : "Una nueva visita al patio"}</span><div><button type="button" className="r-text-button r-point-trigger" onClick={() => setPanel("location")}><MapPin size={14} aria-hidden="true" />{point.name} · demo</button><button type="button" className="r-text-button" onClick={() => setPanel("mode")}>Cambiar modalidad</button><button type="button" className="r-text-button" onClick={() => setPanel("profile")}>Mi perfil · demo</button>{(visit || order) && <button type="button" className="r-text-button" onClick={follow}>Mi seguimiento</button>}</div></div>
    {!storageAvailable && <p className="r-storage-note" role="status">El navegador no permite guardar esta prueba. Funcionará durante esta página; al recargar comenzará otra visita.</p>}
    {visit?.stage === "seated" && !visit.acknowledged && !order && !trackingOpen && <motion.div className="r-table-alert" initial={reduced ? false : { opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} role="status"><UtensilsCrossed size={23} aria-hidden="true" /><span>Tu mesa {visit.table} ya te espera.</span><button type="button" className="r-text-button" onClick={follow}>Ver mi mesa</button><button type="button" className="r-text-button" onClick={() => dispatch({ type: "acknowledge" })}>Entendido</button></motion.div>}
    <main id="contenido" tabIndex={-1}>
      <section id="inicio" className="r-hero">
        <div className="r-hero-copy"><p className="r-kicker">COCINA DE BARRIO · PATIO 12</p><h1>Buen comer.<br /><em>Sin prisa.</em></h1><p>Una pasta bien hecha, algo fresco y una mesa para quedarse un rato. Así se come en el patio.</p>
          <div className="r-hero-actions"><a href="#carta" className="r-button" onClick={navigateToSection}>Ver la carta <ArrowDown size={18} aria-hidden="true" /></a><button type="button" className="r-secondary-button" onClick={() => setPanel("reservation")}>Reservar mesa</button></div>
          <div className="r-hero-facts"><p><Clock size={17} aria-hidden="true" /><span>Mar–dom · 13:00–22:00<br /><small>Lunes descansamos</small></span></p><p><MapPin size={17} aria-hidden="true" /><span>{point.name}<br /><small>Punto de demostración · {point.city}</small></span></p></div>
          <p className="r-hero-note">Restaurante y precios de ejemplo. Pedidos y reservas simulados.</p>
        </div>
        <div className="r-hero-photo"><div className="r-hero-seal"><PatioSeal /></div><img src="/restaurante/pasta.webp" width="1000" height="667" alt="Fotografía ilustrativa de pasta con pesto y jitomates" fetchPriority="high" /><div className="r-photo-caption"><span>Hoy se antoja</span><strong>Pasta de la casa</strong><span>{money(195)} MXN</span></div></div>
      </section>
      <div className="r-intro-strip"><p>Hecho al momento.</p><span aria-hidden="true">✳</span><p>Para compartir o para ti.</p><span aria-hidden="true">✳</span><p>La sobremesa también cuenta.</p></div>
      <section className="r-featured" aria-labelledby="featured-title"><div className="r-section-head"><h2 id="featured-title" tabIndex={-1}>Los que siempre<br />vuelven a la mesa.</h2><p>Tres maneras de empezar.<br />El resto te espera en la carta.</p></div>
        <div className="r-featured-grid">{FEATURED.map((item, index) => <Reveal key={item.id} className={`r-featured-item r-featured-${index}`}><button type="button" onClick={() => choose(item)} className="r-food-photo" aria-label={`Elegir ${item.name}`}><img src={item.photos[0].src} width="1000" height="667" loading="lazy" alt={`Fotografía ilustrativa de ${item.name.toLowerCase()}`} /><span><ArrowUpRight size={23} aria-hidden="true" /></span></button><div className="r-food-title"><h3>{item.name}</h3><strong>{money(item.price)}</strong></div><p>{item.description}</p></Reveal>)}</div>
      </section>
      <section id="carta" className="r-menu-section"><div className="r-section-head"><h2 tabIndex={-1}>La carta,<br />sin vueltas.</h2><p>Precios finales de ejemplo en MXN.<br />Elige un plato para configurar tu pedido.</p></div>
        <div className="r-menu-tools"><div className="r-category-list" role="group" aria-label="Filtrar carta por categoría">{CATEGORIES.map(label => <button type="button" key={label} aria-pressed={category === label} onClick={() => setCategory(label)}>{label}</button>)}</div><label className="r-diet-filter">Preferencia<select value={diet} onChange={event => setDiet(event.target.value)}>{DIETS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label className="r-search"><Search size={18} aria-hidden="true" /><span className="r-sr-only">Buscar en la carta</span><input type="search" placeholder="¿Qué se te antoja?" value={search} onChange={event => setSearch(event.target.value)} /></label></div>
        <p className="r-menu-count" role="status">{filtered.length} {filtered.length === 1 ? "opción" : "opciones"}{category !== "Todo" ? ` · ${category}` : ""}{search ? ` · búsqueda: ${search}` : ""}</p>
        {filtered.length ? <div className="r-menu-list">{filtered.map((item, index) => { const info = nutrition(item); return <article key={item.id} className="r-menu-item"><PhotoGallery product={item} compact /><div className="r-item-copy"><div className="r-item-title"><h3><span className="r-menu-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{item.name}</h3><strong>{money(item.price)}</strong></div><p>{item.description}</p><p className="r-card-nutrients">{info.protein} g proteína · {info.carbs} g carbohidratos · {info.fat} g grasas · {info.kcal} kcal de ejemplo</p><span className="r-menu-tag">{dietLabel(dietaryTag(item))}</span><button type="button" className="r-text-button" aria-label={`Elegir ${item.name}`} onClick={() => choose(item)}>Ver y personalizar <ArrowUpRight size={16} aria-hidden="true" /></button></div></article> })}</div> : <div className="r-empty-search"><h3>No encontramos ese antojo.</h3><p>Prueba con “pasta”, “pollo” o una categoría diferente.</p><button type="button" className="r-secondary-button" onClick={() => { setSearch(""); setCategory("Todo"); setDiet("all") }}>Ver toda la carta</button></div>}
        <div className="r-menu-foot"><p>Ingredientes, nutrientes y alérgenos ficticios. Los filtros describen la receta base; añadir carne o sustituir ingredientes cambia la configuración. Una cocina real debe validar sus fichas.</p><button type="button" className="r-text-button" onClick={() => setPanel("order")}>Revisar mi pedido <ArrowUpRight size={18} aria-hidden="true" /></button></div>
      </section>
      <section id="el-patio" className="r-place"><Reveal className="r-place-photo"><img src="/restaurante/patio.webp" width="1400" height="933" loading="lazy" alt="Fotografía ilustrativa del interior de un restaurante con mesas y plantas" /><span>Un espacio para la sobremesa.</span></Reveal><div className="r-place-copy"><h2 tabIndex={-1}>Tu mesa.<br />Tu gente.<br /><em>Tu rato.</em></h2><p>La comida importa. Poder conversar a gusto, también. Imagina un lugar con mesas para dos, comidas en familia y una pausa a mitad de la semana.</p><p>Ven por un plato, quédate por la conversación. En la carta hay opciones vegetarianas, platos para compartir y algo dulce para cerrar.</p><button type="button" className="r-button" onClick={() => setPanel("reservation")}>Encontrar una mesa <ArrowUpRight size={18} aria-hidden="true" /></button><p className="r-demo-note">La fotografía ilustra el concepto; no representa un establecimiento real.</p></div></section>
      <section id="visitanos" className="r-visit"><h2 tabIndex={-1}>Un patio.<br />Ocho escenarios.</h2><div className="r-visit-details"><div><h3>Puntos de demostración</h3><p>De Xalapa a Tijuana: prueba la experiencia alrededor de parques y plazas de siete ciudades mexicanas.</p><p className="r-demo-note">Son referencias geográficas. Patio 12 no tiene sucursales en ellas.</p><button type="button" className="r-text-button" onClick={() => setPanel("location")}>Explorar puntos y mapa <ArrowUpRight size={18} aria-hidden="true" /></button></div><div><h3>A la hora de comer</h3><dl><div><dt>Martes a domingo</dt><dd>13:00–22:00</dd></div><div><dt>Lunes</dt><dd>Cerrado</dd></div></dl><p>Última reserva de ejemplo: 20:30.<br />Pedidos para recoger: hasta las 21:00.</p><button type="button" className="r-text-button" onClick={() => setPanel("whatsapp")}>Preguntar por WhatsApp · demo <ArrowUpRight size={18} aria-hidden="true" /></button></div></div></section>
      <ComercialCTA giro="restaurante" accentColor="#edd068" backgroundColor="#203b2e" textColor="#ffffff" fontFamily="Patio Sans, sans-serif" headingFontFamily="Patio Bitter, serif" radius={4} />
      <footer className="r-footer"><a href="#inicio" onClick={navigateToSection}>patio <strong>12</strong></a><p>Identidad ficticia · Prototipo interactivo de Ian Aldana Martínez</p><button type="button" className="r-text-button" onClick={() => setPanel("privacy")}>Privacidad de la demo</button></footer>
    </main>
    <div className="r-announcement" role="status" aria-live="polite">{notice && <><span>{notice}</span><button type="button" aria-label="Ocultar aviso del pedido" onClick={() => setNotice("")}><X size={16} aria-hidden="true" /></button></>}</div>

    <WaterMark />
    {menuOpen && <Modal title="Menú del restaurante" onClose={() => setMenuOpen(false)} className="restaurant-modal" radius={4}><div className="r-mobile-links">{navLinks()}<button type="button" className="r-button" onClick={() => { setMenuOpen(false); setPanel("reservation") }}>Reservar mesa</button></div></Modal>}
    {panel === "product" && <ItemPicker key={editing?.key || product.id} product={product} cart={cart} editing={editing} allowed={canOrder(state)} blockedReason={order ? "Tu pedido ya está confirmado. Termina su recorrido antes de añadir otro plato." : null} onWait={() => { close(); follow() }} onAdd={add} onClose={close} />}
    {panel === "order" && <OrderFlow onClose={close} onMenu={goToMenu} onTracking={follow} onMode={() => setPanel("mode")} onProfile={() => setPanel("profile")} onEdit={row => choose(findProduct(row.productId), row)} />}
    {!entry && (trackingOpen || panel === "tracking") && <TrackingPanel onClose={close} onMenu={goToMenu} onProfile={() => { close(); setPanel("profile") }} />}
    {panel === "profile" && <ProfilePanel onClose={close} onReset={() => { dispatch({ type: "reset" }); close(); setNotice("") }} />}
    {(panel === "mode" || !visit && !order && !panel && !entry) && <ServiceChoice initial={!visit && !order} onClose={mode => { close(); if (mode === "dine") setPanel("tracking") }} onReservation={() => { close(); setPanel("reservation") }} />}
    {panel === "reservation" && <TableReservation key={state.pointId} pointId={state.pointId} onClose={close} />}
    <WhatsAppPreview isOpen={panel === "whatsapp"} onClose={close} businessName="Patio 12" fontFamily="Patio Sans, sans-serif" radius={4} messages={["Hola, ¿cómo puedo reservar una mesa?", "Hola, ¿puedo pedir para recoger?", "Hola, ¿qué opciones vegetarianas tienen?"]} autoReply="¡Hola! Consulta la carta y los horarios en el sitio. Las opciones vegetarianas están señaladas. Puedes probar Reservar mesa o añadir platos para recoger. Esta respuesta es de ejemplo." />
    {panel === "location" && <LocationExplorer onClose={close} />}
    {entry && <EntryPanel entry={entry} onClose={() => navigate("/restaurante", { replace: true })} onStart={seated => { navigate("/restaurante", { replace: true }); if (seated) setPanel("tracking") }} />}
    {panel === "privacy" && <Modal title="Privacidad de la demo de restaurante" onClose={close} className="restaurant-modal" radius={4}><div className="r-privacy"><p>Utiliza solamente datos ficticios. El punto elegido, la visita, el carrito y el pedido activo se guardan en el almacenamiento local de este navegador, junto con la posición del contador. Se recuperan al volver o recargar, y la visita caduca a las seis horas de su inicio.</p><p>Si activas el perfil de ejemplo, este conserva hasta diez recibos y su contador de visitas. No es una cuenta autenticada ni se comparte entre dispositivos. Un invitado deja de conservar su pedido al finalizar la sesión. “Reiniciar datos de la demo”, en Mi perfil, borra estos datos del restaurante.</p><p>No se solicitan tarjetas, contraseñas ni datos fiscales. No se realizan pagos, correos, pedidos o reservas reales. La reserva futura y WhatsApp permanecen en memoria y se descartan al cerrar su ventana. Fotos y fuentes del restaurante se sirven localmente. Al pulsar “Mostrar mapa interactivo”, se consulta la cartografía de OpenFreeMap/OpenStreetMap; esos proveedores reciben las solicitudes e información técnica de conexión. Sin abrir el mapa no se solicitan sus teselas. El alojamiento recibe las solicitudes necesarias para cargar la página.</p><p>La ventana flotante de escritorio es opcional y depende del navegador. Termina al cerrar la pestaña; no se pide acceso a notificaciones. “Usar mi ubicación” solicita opcionalmente la geolocalización del navegador para encontrar la referencia más cercana. Se usa en memoria y no se guarda ni se envía al mapa; el dispositivo o navegador puede usar sus propios servicios de ubicación. Si no la autorizas, la lista manual sigue disponible.</p><p>Los QR contienen únicamente el punto y, si se elige, la mesa ficticia. No comparten pedidos o perfiles entre dispositivos. Las rutas y coberturas son preparadas e ilustrativas; no se consultan domicilios ni tráfico.</p><p>La portada y Psicólogo conservan su propio comportamiento: pueden utilizar Google Fonts, Unsplash y almacenamiento local de preferencias. Sus avisos describen esas funciones.</p><p>“Contactar” y “Hablemos” abren los canales reales de Ian. Se aplican las condiciones del proveedor que elijas. Este texto explica un prototipo; un negocio real necesitará su propio aviso.</p></div><button type="button" className="r-button r-full" onClick={close}>Entendido</button></Modal>}
  </div>
}
