import { useId } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

export default function PanelSurface({ title, children }) {
  const id = useId()
  return <section className="r-panel-page" aria-labelledby={id}>
    <Link to="/restaurante/carta" className="r-text-button"><ArrowLeft size={16} aria-hidden="true" /> Volver a la carta</Link>
    <h1 id={id} tabIndex={-1}>{title}</h1>
    <div className="r-panel-body">{children}</div>
  </section>
}
