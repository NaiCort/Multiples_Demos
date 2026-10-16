import { Link } from "react-router-dom"
import { ArrowUpRight, Clock, MapPin } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import { FEATURED, money } from "../data/menu"
import { localLabel, POINTS, pointOrDefault } from "../data/locations"
import { useRestaurant } from "../state/context"
import PatioSeal from "../components/PatioSeal"
import ServiceOptions from "../components/ServiceOptions"
import LocationCard from "../components/LocationCard"

export default function Inicio({ onChoose, onMode, onReserve, onLocalOrder, onLocalReserve }) {
  const { state } = useRestaurant()
  const point = pointOrDefault(state.pointId)
  const reduced = useReducedMotion()
  return <>
    <section className="r-hero" id="inicio">
      <div className="r-hero-copy"><p className="r-kicker">COCINA DE BARRIO · PATIO 12</p><h1 tabIndex={-1}>Buen comer.<br /><em>Sin prisa.</em></h1>
        <p>Una pasta bien hecha, algo fresco y una mesa para quedarse un rato. Así se come en el patio.</p>
        <div className="r-hero-actions"><Link to="/restaurante/carta" className="r-button">Explorar la carta <ArrowUpRight size={18} aria-hidden="true" /></Link><button type="button" className="r-secondary-button" onClick={() => onReserve()}>Reservar mesa</button></div>
        <div className="r-hero-facts"><p><Clock size={17} aria-hidden="true" /><span>Mar–dom · 13:00–22:00<br /><small>Horario de muestra</small></span></p><p><MapPin size={17} aria-hidden="true" /><span>{localLabel(point.id)}<br /><small>Local simulado · referencia: {point.name}</small></span></p></div>
        <p className="r-hero-note">Un restaurante ficticio para explorar, reservar y pedir de forma simulada.</p>
      </div>
      <div className="r-hero-photo"><div className="r-hero-seal"><PatioSeal /></div><img src="/restaurante/pasta.webp" width="1000" height="667" alt="Fotografía ilustrativa de pasta con pesto y jitomates" fetchPriority="high" /><div className="r-photo-caption"><span>Hoy se antoja</span><strong>Pasta de la casa</strong><span>{money(195)} MXN</span></div></div>
    </section>
    <div className="r-intro-strip"><p>Hecho al momento.</p><span aria-hidden="true">✳</span><p>Para compartir o para ti.</p><span aria-hidden="true">✳</span><p>La sobremesa también cuenta.</p></div>
    <section className="r-home-service r-page-section" aria-labelledby="service-title"><div className="r-section-head"><div><p className="r-kicker">TÚ ELIGES EL PLAN</p><h2 id="service-title">¿Cómo vienes hoy?</h2></div><p>Local simulado: {localLabel(point.id)}.<br />Puedes cambiarlo desde la barra superior.</p></div><ServiceOptions onSelect={onMode} /><button type="button" className="r-text-button" onClick={() => onReserve()}>Reservar para otra fecha <ArrowUpRight size={16} aria-hidden="true" /></button></section>
    <section className="r-featured" aria-labelledby="featured-title"><div className="r-section-head"><h2 id="featured-title">Los que siempre<br />vuelven a la mesa.</h2><Link to="/restaurante/carta" className="r-text-button">Ver toda la carta <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
      <div className="r-featured-grid">{FEATURED.map((item, index) => <motion.article key={item.id} className={`r-featured-item r-featured-${index}`} initial={reduced ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .08 }} transition={{ duration: reduced ? 0 : .4 }}><button type="button" onClick={() => onChoose(item)} className="r-food-photo" aria-label={`Elegir ${item.name}`}><img src={item.photos[0].src} width="1000" height="667" loading="lazy" alt={`Fotografía ilustrativa de ${item.name.toLowerCase()}`} /><span><ArrowUpRight size={23} aria-hidden="true" /></span></button><div className="r-food-title"><h3>{item.name}</h3><strong>{money(item.price)}</strong></div><p>{item.description}</p></motion.article>)}</div>
    </section>
    <section className="r-home-locals r-page-section" aria-labelledby="home-locals-title"><div className="r-section-head"><div><p className="r-kicker">DEL CENTRO AL NORTE</p><h2 id="home-locals-title">Un patio.<br />{POINTS.length} escenarios.</h2></div><Link to="/restaurante/locales" className="r-text-button">Explorar todos los locales <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
      <p className="r-section-intro">Imagina el patio en distintas ciudades de México y Estados Unidos. Cada local de esta demo tiene su propia ficha, tomando un parque o plaza como referencia geográfica.</p>
      <div className="r-locals-grid">{["chapultepec", "xalapa", "merida"].map((id, index) => <LocationCard key={id} point={POINTS.find(item => item.id === id)} index={index} selected={id === state.pointId} onOrder={onLocalOrder} onReserve={onLocalReserve} />)}</div>
    </section>
    <section className="r-place"><div className="r-place-photo"><img src="/restaurante/patio.webp" width="1400" height="933" loading="lazy" alt="Ambientación ilustrativa de un restaurante con mesas y plantas" /><span>Un espacio para la sobremesa.</span></div><div className="r-place-copy"><p className="r-kicker">EL GUSTO DE QUEDARSE</p><h2>Tu mesa.<br />Tu gente.<br /><em>Tu rato.</em></h2><p>La comida importa. Poder conversar a gusto, también. Conoce la idea detrás del patio y al equipo de ejemplo que le da forma.</p><Link to="/restaurante/conocenos" className="r-button">Conócenos <ArrowUpRight size={18} aria-hidden="true" /></Link><p className="r-demo-note">Ambientación ilustrativa; no representa un establecimiento real.</p></div></section>
  </>
}
