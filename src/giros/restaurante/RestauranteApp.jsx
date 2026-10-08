import { useReducer, useRef, useState } from "react"
import { ArrowDown, ArrowUpRight, Clock, MapPin, Menu as MenuIcon, Search, ShoppingBag, UtensilsCrossed, X } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import DemoBanner from "../../components/shared/DemoBanner"
import Modal from "../../components/shared/Modal"
import ComercialCTA from "../../components/shared/ComercialCTA"
import WaterMark from "../../components/WaterMark"
import useFavicon from "../../hooks/useFavicon"
import usePageMetadata from "../../hooks/usePageMetadata"
import useRouteFocus from "../../hooks/useRouteFocus"
import useDemoNavigation from "../../hooks/useDemoNavigation"
import { CATEGORIES, FEATURED, MENU, money, normalizeSearch } from "./data/menu"
import { cartReducer, subtotal } from "./data/order"
import ItemPicker from "./components/ItemPicker"
import OrderFlow from "./components/OrderFlow"
import TableReservation from "./components/TableReservation"
import WhatsAppPreview from "../../components/shared/WhatsAppPreview"
import "./restaurante.css"

const NAV_IDS = ["inicio", "carta", "el-patio", "visitanos"]
const LINKS = [["carta", "La carta"], ["el-patio", "El patio"], ["visitanos", "Visítanos"]]
function RestaurantGuide() {
  return <div className="space-y-4 text-sm leading-relaxed text-slate-300">
    <p>Patio 12 es un restaurante ficticio. Esta primera identidad representa un restaurante de barrio; las otras identidades se desarrollarán después.</p>
    <ul className="list-disc pl-5 space-y-3"><li>Explora la carta por categoría o busca un plato. Pulsa “Elegir” para ver ingredientes, alérgenos y extras.</li><li>Abre tu pedido, corrige cantidades o quita platos. Prueba recogida y entrega simulada; el total cambia según tu elección.</li><li>Reserva una mesa de ejemplo. Cambiar el grupo o el día borra el horario anterior para que puedas elegir otro.</li></ul>
    <p>Los pedidos, las reservas y el WhatsApp se pueden cerrar y reiniciar. No hay pagos, envíos ni mesas reales. Los datos se descartan al recargar o salir de esta demo.</p>
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
  const [cart, dispatch] = useReducer(cartReducer, [])
  const [panel, setPanel] = useState(null)
  const [product, setProduct] = useState(null)
  const [category, setCategory] = useState("Todo")
  const [search, setSearch] = useState("")
  const [notice, setNotice] = useState("")
  const cartButton = useRef(null)
  const count = cart.reduce((sum, row) => sum + row.quantity, 0)
  const query = normalizeSearch(search)
  const filtered = MENU.filter(item => (category === "Todo" || item.category === category) && normalizeSearch(`${item.name} ${item.description} ${item.tag || ""}`).includes(query))
  const choose = item => { setProduct(item); setPanel("product") }
  const close = () => { setPanel(null) }
  const goToMenu = () => {
    setPanel(null)
    requestAnimationFrame(() => { const section = document.getElementById("carta"); section?.scrollIntoView({ block: "start" }); section?.querySelector("h2")?.focus({ preventScroll: true }) })
  }
  const add = action => {
    dispatch(action); setNotice(`${product.name}: añadido al pedido.`); setPanel(null)
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
    <main id="contenido" tabIndex={-1}>
      <section id="inicio" className="r-hero">
        <div className="r-hero-copy"><h1>Buen comer.<br /><em>Sin prisa.</em></h1><p>Una pasta bien hecha, algo fresco y una mesa para quedarse un rato. Así se come en el patio.</p>
          <div className="r-hero-actions"><a href="#carta" className="r-button" onClick={navigateToSection}>Ver la carta <ArrowDown size={18} aria-hidden="true" /></a><button type="button" className="r-secondary-button" onClick={() => setPanel("reservation")}>Reservar mesa</button></div>
          <div className="r-hero-facts"><p><Clock size={17} aria-hidden="true" /><span>Mar–dom · 13:00–22:00<br /><small>Lunes descansamos</small></span></p><p><MapPin size={17} aria-hidden="true" /><span>Av. del Jardín 12<br /><small>Dirección ficticia</small></span></p></div>
          <p className="r-hero-note">Restaurante y precios de ejemplo. Pedidos y reservas simulados.</p>
        </div>
        <div className="r-hero-photo"><img src="/restaurante/pasta.webp" width="1000" height="667" alt="Fotografía ilustrativa de pasta con pesto y jitomates" fetchPriority="high" /><div className="r-photo-caption"><span>Hoy se antoja</span><strong>Pasta de la casa</strong><span>{money(195)} MXN</span></div></div>
      </section>
      <div className="r-intro-strip"><p>Hecho al momento.</p><span aria-hidden="true">✳</span><p>Para compartir o para ti.</p><span aria-hidden="true">✳</span><p>La sobremesa también cuenta.</p></div>
      <section className="r-featured" aria-labelledby="featured-title"><div className="r-section-head"><h2 id="featured-title" tabIndex={-1}>Los que siempre<br />vuelven a la mesa.</h2><p>Tres maneras de empezar.<br />El resto te espera en la carta.</p></div>
        <div className="r-featured-grid">{FEATURED.map((item, index) => <Reveal key={item.id} className={`r-featured-item r-featured-${index}`}><button type="button" onClick={() => choose(item)} className="r-food-photo" aria-label={`Elegir ${item.name}`}><img src={`/restaurante/${item.photo}.webp`} width="1000" height="667" loading="lazy" alt={`Fotografía ilustrativa de ${item.name.toLowerCase()}`} /><span><ArrowUpRight size={23} aria-hidden="true" /></span></button><div className="r-food-title"><h3>{item.name}</h3><strong>{money(item.price)}</strong></div><p>{item.description}</p></Reveal>)}</div>
      </section>
      <section id="carta" className="r-menu-section"><div className="r-section-head"><h2 tabIndex={-1}>La carta,<br />sin vueltas.</h2><p>Precios finales de ejemplo en MXN.<br />Elige un plato para configurar tu pedido.</p></div>
        <div className="r-menu-tools"><div className="r-category-list" role="group" aria-label="Filtrar carta por categoría">{CATEGORIES.map(label => <button type="button" key={label} aria-pressed={category === label} onClick={() => setCategory(label)}>{label}</button>)}</div><label className="r-search"><Search size={18} aria-hidden="true" /><span className="r-sr-only">Buscar en la carta</span><input type="search" placeholder="¿Qué se te antoja?" value={search} onChange={event => setSearch(event.target.value)} /></label></div>
        <p className="r-menu-count" role="status">{filtered.length} {filtered.length === 1 ? "opción" : "opciones"}{category !== "Todo" ? ` · ${category}` : ""}{search ? ` · búsqueda: ${search}` : ""}</p>
        {filtered.length ? <div className="r-menu-list">{filtered.map(item => <article key={item.id} className="r-menu-item"><div><h3>{item.name}</h3><p>{item.description}</p>{item.tag && <span className="r-menu-tag">{item.tag}</span>}</div><div className="r-menu-price"><strong>{money(item.price)}</strong><button type="button" aria-label={`Elegir ${item.name}`} onClick={() => choose(item)}>Elegir <PlusSymbol /></button></div></article>)}</div> : <div className="r-empty-search"><h3>No encontramos ese antojo.</h3><p>Prueba con “pasta”, “pollo” o una categoría diferente.</p><button type="button" className="r-secondary-button" onClick={() => { setSearch(""); setCategory("Todo") }}>Ver toda la carta</button></div>}
        <div className="r-menu-foot"><p>Los ingredientes y alérgenos son de ejemplo. En un sitio real deben validarse con la cocina.</p><button type="button" className="r-text-button" onClick={() => setPanel("order")}>Revisar mi pedido <ArrowUpRight size={18} aria-hidden="true" /></button></div>
      </section>
      <section id="el-patio" className="r-place"><Reveal className="r-place-photo"><img src="/restaurante/patio.webp" width="1400" height="933" loading="lazy" alt="Fotografía ilustrativa del interior de un restaurante con mesas y plantas" /><span>Un espacio para la sobremesa.</span></Reveal><div className="r-place-copy"><h2 tabIndex={-1}>Tu mesa.<br />Tu gente.<br /><em>Tu rato.</em></h2><p>La comida importa. Poder conversar a gusto, también. Imagina un lugar con mesas para dos, comidas en familia y una pausa a mitad de la semana.</p><p>Ven por un plato, quédate por la conversación. En la carta hay opciones vegetarianas, platos para compartir y algo dulce para cerrar.</p><button type="button" className="r-button" onClick={() => setPanel("reservation")}>Encontrar una mesa <ArrowUpRight size={18} aria-hidden="true" /></button><p className="r-demo-note">La fotografía ilustra el concepto; no representa un establecimiento real.</p></div></section>
      <section id="visitanos" className="r-visit"><h2 tabIndex={-1}>Nos vemos<br />en el patio.</h2><div className="r-visit-details"><div><h3>El lugar de ejemplo</h3><p>Av. del Jardín 12<br />Colonia Centro · Ciudad de ejemplo</p><button type="button" className="r-text-button" onClick={() => setPanel("location")}>Ver ubicación de ejemplo <ArrowUpRight size={18} aria-hidden="true" /></button></div><div><h3>A la hora de comer</h3><dl><div><dt>Martes a domingo</dt><dd>13:00–22:00</dd></div><div><dt>Lunes</dt><dd>Cerrado</dd></div></dl><p>Última reserva de ejemplo: 20:30.<br />Pedidos para recoger: hasta las 21:00.</p><button type="button" className="r-text-button" onClick={() => setPanel("whatsapp")}>Preguntar por WhatsApp · demo <ArrowUpRight size={18} aria-hidden="true" /></button></div></div></section>
      <ComercialCTA giro="restaurante" accentColor="#edd068" backgroundColor="#203b2e" textColor="#ffffff" fontFamily="Patio Sans, sans-serif" headingFontFamily="Patio Bitter, serif" radius={4} />
      <footer className="r-footer"><a href="#inicio" onClick={navigateToSection}>patio <strong>12</strong></a><p>Identidad ficticia · Prototipo interactivo de Ian Aldana Martínez</p><button type="button" className="r-text-button" onClick={() => setPanel("privacy")}>Privacidad de la demo</button></footer>
    </main>
    <div className="r-announcement" role="status" aria-live="polite">{notice && <><span>{notice}</span><button type="button" aria-label="Ocultar aviso del pedido" onClick={() => setNotice("")}><X size={16} aria-hidden="true" /></button></>}</div>
    {count > 0 && <button type="button" className="r-floating-cart" aria-label={`Abrir pedido de ${count} productos, ${money(subtotal(cart))}`} onClick={() => setPanel("order")}><ShoppingBag size={19} aria-hidden="true" /><span>Ver pedido · {count}</span><strong>{money(subtotal(cart))}</strong></button>}
    <WaterMark />
    {menuOpen && <Modal title="Menú del restaurante" onClose={() => setMenuOpen(false)} className="restaurant-modal" radius={4}><div className="r-mobile-links">{navLinks()}<button type="button" className="r-button" onClick={() => { setMenuOpen(false); setPanel("reservation") }}>Reservar mesa</button></div></Modal>}
    {panel === "product" && <ItemPicker product={product} cart={cart} onAdd={add} onClose={close} />}
    {panel === "order" && <OrderFlow cart={cart} dispatch={dispatch} onClose={close} onMenu={goToMenu} />}
    {panel === "reservation" && <TableReservation onClose={close} />}
    <WhatsAppPreview isOpen={panel === "whatsapp"} onClose={close} businessName="Patio 12" fontFamily="Patio Sans, sans-serif" radius={4} messages={["Hola, ¿cómo puedo reservar una mesa?", "Hola, ¿puedo pedir para recoger?", "Hola, ¿qué opciones vegetarianas tienen?"]} autoReply="¡Hola! Consulta la carta y los horarios en el sitio. Las opciones vegetarianas están señaladas. Puedes probar Reservar mesa o añadir platos para recoger. Esta respuesta es de ejemplo." />
    {panel === "location" && <Modal title="Ubicación de ejemplo" onClose={close} className="restaurant-modal" radius={4}><p className="r-muted">Esta dirección es ficticia. En el sitio de un restaurante real, este espacio mostraría su ubicación y un enlace a un servicio de mapas.</p><div className="r-location-plan" aria-label="Esquema ilustrativo: Patio 12 junto al parque, sobre Avenida del Jardín"><div>Parque de ejemplo</div><p>Avenida del Jardín</p><strong><MapPin size={22} aria-hidden="true" /> Patio 12</strong></div><p className="r-demo-note">No se abre un mapa externo ni se dirige a un negocio ajeno.</p><button type="button" className="r-button r-full" onClick={close}>Entendido</button></Modal>}
    {panel === "privacy" && <Modal title="Privacidad de la demo de restaurante" onClose={close} className="restaurant-modal" radius={4}><div className="r-privacy"><p>Utiliza datos ficticios. El pedido, la reserva y la conversación de WhatsApp permanecen en memoria, no se envían a un servidor y se descartan al recargar o salir de Restaurante.</p><p>Este giro no guarda pedidos, reservas ni preferencias en el almacenamiento local. Las fotografías y las fuentes de Patio 12 se sirven con los archivos de la página. El alojamiento recibe las solicitudes necesarias para cargarla.</p><p>La portada y Psicólogo conservan su propio comportamiento: pueden utilizar Google Fonts, Unsplash y almacenamiento local de preferencias. Sus avisos describen esas funciones.</p><p>“Contactar” y “Hablemos” abren los canales reales de Ian. Se aplican las condiciones del proveedor que elijas. Este texto explica un prototipo; un negocio real necesitará su propio aviso.</p></div><button type="button" className="r-button r-full" onClick={close}>Entendido</button></Modal>}
  </div>
}
function PlusSymbol() { return <span aria-hidden="true">+</span> }
