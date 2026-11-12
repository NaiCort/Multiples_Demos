import { Clock, MapPin, MessageCircle } from "lucide-react"
import ContourMap from "../components/ContourMap"
import LoteSheet from "../components/LoteSheet"
import { LOTES, LOTE_SEMANA, metros } from "../data/lotes"
import { LOCAL } from "../data/local"

export default function Inicio({ onWhatsApp }) {
  const otros = LOTES.filter((lote) => !lote.semana)
  const rango = LOTES.map((lote) => lote.altitud)
  return (
    <>
      <section className="l-hero" aria-labelledby="l-titulo">
        <div className="l-hero-text">
          <h1 id="l-titulo" tabIndex={-1}>
            Café de ladera, tostado en Xalapa.
          </h1>
          <p className="l-lead">
            Servimos lotes de fincas veracruzanas entre {metros(Math.min(...rango))} y{" "}
            {metros(Math.max(...rango))}. De cada uno publicamos quién lo cultivó, cómo se procesó y
            cuánto le pagamos.
          </p>
          <ul className="l-hero-facts">
            <li>
              <Clock size={17} aria-hidden="true" />
              <span>
                {LOCAL.horario[0].dias} {LOCAL.horario[0].horas}
              </span>
            </li>
            <li>
              <MapPin size={17} aria-hidden="true" />
              <span>
                {LOCAL.zona} · {LOCAL.referencia}
              </span>
            </li>
          </ul>
          <div className="l-actions">
            <a className="l-button l-button-ink" href="#lote-semana">
              Ver el lote de la semana
            </a>
            <button type="button" className="l-button l-button-line" onClick={onWhatsApp}>
              <MessageCircle size={17} aria-hidden="true" />
              Escribir por WhatsApp
            </button>
          </div>
          <p className="l-fiction">
            Ladera es un café ficticio. Productores, fincas, cifras y precios son de ejemplo.
          </p>
        </div>
        <figure className="l-hero-map">
          <ContourMap lote={LOTE_SEMANA} />
          <figcaption>
            {LOTE_SEMANA.finca}, {LOTE_SEMANA.municipio}. Una curva cada 50 metros.
          </figcaption>
        </figure>
      </section>

      <section id="lote-semana" className="l-section" aria-labelledby="l-semana-titulo">
        <h2 id="l-semana-titulo">Esta semana en la barra</h2>
        <p className="l-section-lead">
          Lo preparamos en espresso y en filtrado. La ficha es la misma que acompaña cada taza.
        </p>
        <LoteSheet lote={LOTE_SEMANA} headingId="l-semana-lote" />
      </section>

      <section className="l-section l-section-tight" aria-labelledby="l-otros-titulo">
        <h2 id="l-otros-titulo">También en la barra</h2>
        <ul className="l-lot-list">
          {otros.map((lote) => (
            <li key={lote.id} style={{ "--lote": lote.color }}>
              <strong>{lote.nombre}</strong>
              <span>{lote.municipio}</span>
              <span className="l-num">{metros(lote.altitud)}</span>
              <span>{lote.proceso}</span>
              <span className="l-notes">{lote.notas.join(", ")}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="visitanos" className="l-section l-visit" aria-labelledby="l-visita-titulo">
        <div>
          <h2 id="l-visita-titulo">Un solo local</h2>
          <p>
            {LOCAL.zona}, {LOCAL.referencia}. El parque es solo una referencia: el local no existe.
          </p>
          <p>{LOCAL.tueste}</p>
        </div>
        <table className="l-hours">
          <caption>Horario de ejemplo</caption>
          <tbody>
            {LOCAL.horario.map((row) => (
              <tr key={row.dias}>
                <th scope="row">{row.dias}</th>
                <td>{row.horas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  )
}
