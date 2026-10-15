import { ArrowUpRight, Bike, ShoppingBag, UtensilsCrossed } from "lucide-react"

export default function ServiceOptions({ onSelect }) {
  return <div className="r-service-options">{[
    ["dine", "Comer aquí", "Una mesa para ti. Espera de un minuto que puedes saltar en esta demo.", UtensilsCrossed],
    ["pickup", "Para llevar", "Elige tus platos y recibe un turno para recogerlos.", ShoppingBag],
    ["delivery", "A domicilio", "Configura el pedido y prueba una entrega de ejemplo.", Bike],
  ].map(([mode, title, text, Icon]) => <button type="button" className="r-service-card" key={mode} aria-label={title} onClick={() => onSelect(mode)}>
    <Icon size={25} aria-hidden="true" /><span><strong>{title}</strong><small>{text}</small></span><ArrowUpRight size={19} aria-hidden="true" />
  </button>)}</div>
}
