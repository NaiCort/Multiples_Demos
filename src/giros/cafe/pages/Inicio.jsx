import { useState } from "react"
import { Link } from "react-router-dom"
import { MapPin, MessageCircle } from "lucide-react"
import ContourMap from "../components/ContourMap"
import Foto from "../components/Foto"
import LoteSheet from "../components/LoteSheet"
import Marquee from "../components/Marquee"
import { findItem } from "../data/carta"
import { LOCAL } from "../data/local"
import { LOTES, LOTE_SEMANA, metros, pesos } from "../data/lotes"
import { HORARIOS_CATA, disponibles, proximosSabados } from "../state/cata"
import { estadoLocal } from "../state/pedido"

const DESTACADOS = [
  { foto: "latte", item: "latte", seccion: "espresso" },
  { foto: "cortado", item: "cortado", seccion: "espresso" },
  { foto: "goteo", item: "v60", seccion: "filtrado" },
]

export default function Inicio({ onWhatsApp }) {
  const otros = LOTES.filter((lote) => !lote.semana)
  const [estado] = useState(() => estadoLocal(new Date()))
  const [cinta] = useState(() => {
    const sabado = proximosSabados(new Date(), 1)[0]
    const libres = disponibles(sabado.iso, HORARIOS_CATA[0])
    return [
      `Hoy en filtrado: ${LOTE_SEMANA.nombre}, ${LOTE_SEMANA.notas.slice(0, 2).join(" y ")}`,
      `Cata del ${sabado.texto} a las ${HORARIOS_CATA[0]}: quedan ${libres} lugares`,
      "Pan de elote de la panadería de la esquina, tibio",
      `Bolsa de ${LOTE_SEMANA.nombre}, 250 g por ${pesos(LOTE_SEMANA.precio250)}`,
    ]
  })
  return (
    <>
      <section className="l-hero" aria-labelledby="l-titulo">
        <div className="l-hero-text">
          <h1 id="l-titulo" tabIndex={-1}>
            Café de ladera, tostado en Xalapa.
          </h1>
          <p className="l-lead">
            Mesas de madera, luz de tarde y lotes de fincas a más de mil metros. Quédate un rato o
            pide para llevar.
          </p>
          <ul className="l-hero-facts">
            <li>
              <strong className={estado.abierto ? "l-open" : ""}>
                {estado.abierto ? "Abierto ahora" : "Cerrado"}
              </strong>
              <span> · {estado.texto} (horario de ejemplo)</span>
            </li>
            <li>
              <MapPin size={17} aria-hidden="true" />
              <span>
                {LOCAL.zona}, {LOCAL.referencia}
              </span>
            </li>
          </ul>
          <div className="l-actions">
            <Link className="l-button l-button-cherry" to="/cafe/carta">
              Pedir para recoger
            </Link>
            <Link className="l-button l-button-line" to="/cafe/carta">
              Ver la carta
            </Link>
          </div>
          <p className="l-fiction">
            Ladera es un café ficticio. Productores, fincas, cifras y precios son de ejemplo.
          </p>
        </div>
        <figure className="l-hero-photo">
          <Foto id="interior" priority sizes="(min-width: 960px) 55vw, 100vw" />
          <figcaption className="l-hero-tag">
            <strong>{LOTE_SEMANA.nombre}</strong>
            <span className="l-num">
              {LOTE_SEMANA.municipio} · {metros(LOTE_SEMANA.altitud)} · en la barra hoy
            </span>
          </figcaption>
        </figure>
      </section>

      <Marquee items={cinta} />

      <section className="l-relief" aria-labelledby="l-relieve-titulo">
        <ContourMap
          lote={LOTE_SEMANA}
          summit="#A3162B"
          seed={29}
          width={1440}
          height={520}
          slice
          className="l-relief-map"
        />
        <div className="l-relief-label">
          <h2 id="l-relieve-titulo">Cómo leer nuestros mapas</h2>
          <p>
            Cada mapa de Ladera muestra la finca vista desde arriba. Cada línea sube 50 metros y la
            cima marca la altitud donde crece el lote: aquí, {LOTE_SEMANA.finca} a{" "}
            {metros(LOTE_SEMANA.altitud)}. Los colores, del grano verde al tostado oscuro, son un
            guiño al tueste. Relieves ilustrativos.
          </p>
        </div>
      </section>

      <section className="l-section l-favorites" aria-labelledby="l-favoritos-titulo">
        <h2 id="l-favoritos-titulo">Lo que más se pide</h2>
        <ul>
          {DESTACADOS.map(({ foto, item, seccion }) => {
            const producto = findItem(item)
            return (
              <li key={item}>
                <Link to={`/cafe/carta#${seccion}`}>
                  <Foto id={foto} sizes="(min-width: 720px) 33vw, 50vw" />
                  <span className="l-fav-name">{producto.nombre}</span>
                  <span className="l-num l-fav-price">{pesos(producto.precio)}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      <section id="lote-semana" className="l-section" aria-labelledby="l-semana-titulo">
        <h2 id="l-semana-titulo">Esta semana en la barra</h2>
        <p className="l-section-lead">
          Lo preparamos en espresso y en filtrado. La ficha es la misma que acompaña cada taza.
        </p>
        <LoteSheet lote={LOTE_SEMANA} headingId="l-semana-lote" />
        <Link className="l-text-link" to="/cafe/origen">
          Ver las fichas de los cuatro lotes
        </Link>
      </section>

      <section className="l-section l-section-tight" aria-labelledby="l-otros-titulo">
        <h2 id="l-otros-titulo">También en la barra</h2>
        <ul className="l-lot-list">
          {otros.map((lote) => (
            <li key={lote.id} style={{ "--lote": lote.color }}>
              <strong>
                <Link to={`/cafe/origen#${lote.id}`}>{lote.nombre}</Link>
              </strong>
              <span>{lote.municipio}</span>
              <span className="l-num">{metros(lote.altitud)}</span>
              <span>{lote.proceso}</span>
              <span className="l-notes">{lote.notas.join(", ")}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="el-lugar" className="l-section l-place" aria-labelledby="l-lugar-titulo">
        <Foto id="salon" className="l-place-photo" sizes="(min-width: 960px) 50vw, 100vw" />
        <div>
          <h2 id="l-lugar-titulo">Un lugar para quedarse</h2>
          <p>{LOCAL.tueste}</p>
          <ul className="l-place-list">
            {LOCAL.lugar.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
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
          <div className="l-actions">
            <Link className="l-button l-button-ink" to="/cafe/visitanos#cata">
              Apartar lugar en la cata
            </Link>
            <button type="button" className="l-button l-button-line" onClick={onWhatsApp}>
              <MessageCircle size={17} aria-hidden="true" />
              Escribir por WhatsApp
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
