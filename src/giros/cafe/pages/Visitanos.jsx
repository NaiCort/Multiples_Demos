import { useEffect, useMemo, useRef, useState } from "react"
import Foto from "../components/Foto"
import { Link } from "react-router-dom"
import { MessageCircle, Minus, Plus } from "lucide-react"
import { LOCAL } from "../data/local"
import { pesos } from "../data/lotes"
import { SELLOS } from "../state/pedido"
import {
  CUPO,
  HORARIOS_CATA,
  PRECIO_CATA,
  disponibles,
  loadCata,
  proximosSabados,
  saveCata,
} from "../state/cata"

const storage = () => {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

function Tarjeta({ visitas, onCanjear }) {
  const llena = visitas >= SELLOS
  return (
    <section className="l-card-visits" aria-labelledby="l-tarjeta-titulo">
      <h2 id="l-tarjeta-titulo">Tarjeta de visitas</h2>
      <p>Cada pedido que recoges suma un sello. Con {SELLOS}, la siguiente bebida es nuestra.</p>
      <ol className="l-stamps" aria-label={`${visitas} de ${SELLOS} sellos`}>
        {Array.from({ length: SELLOS }, (_, i) => (
          <li key={i} className={i < visitas ? "is-on" : ""} aria-hidden="true" />
        ))}
      </ol>
      <p className="l-num l-stamps-count">
        {visitas} de {SELLOS}
      </p>
      {llena ? (
        <button type="button" className="l-button l-button-cherry" onClick={onCanjear}>
          Canjear bebida de cortesía
        </button>
      ) : (
        <Link className="l-text-link" to="/cafe/carta">
          Hacer un pedido para recoger
        </Link>
      )}
      <p className="l-fiction">Tarjeta simulada: vive solo en este navegador.</p>
    </section>
  )
}

function Cata() {
  const fechas = useMemo(() => proximosSabados(new Date()), [])
  const [reserva, setReserva] = useState(() => loadCata(storage()))
  const [fecha, setFecha] = useState(fechas[0].iso)
  const [hora, setHora] = useState(HORARIOS_CATA[0])
  const [personas, setPersonas] = useState(1)
  const [nombre, setNombre] = useState("")
  const [error, setError] = useState(false)
  const [sending, setSending] = useState(false)
  const [confirmCancel, setConfirmCancel] = useState(false)
  const timer = useRef(null)
  const nameRef = useRef(null)
  const resultRef = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])
  useEffect(() => {
    if (reserva) resultRef.current?.focus({ preventScroll: true })
  }, [reserva])
  const libres = disponibles(fecha, hora)
  const maxPersonas = Math.min(4, libres)
  const personasValidas = Math.min(personas, Math.max(1, maxPersonas))

  const submit = (event) => {
    event.preventDefault()
    if (!nombre.trim()) {
      setError(true)
      nameRef.current?.focus()
      return
    }
    setSending(true)
    timer.current = setTimeout(() => {
      const nueva = {
        codigo: `CATA-${String(Date.now()).slice(-4)}`,
        fecha: fechas.find((f) => f.iso === fecha).texto,
        hora,
        personas: personasValidas,
        nombre: nombre.trim().slice(0, 40),
      }
      saveCata(storage(), nueva)
      setReserva(nueva)
      setSending(false)
    }, 800)
  }
  const cancelar = () => {
    saveCata(storage(), null)
    setReserva(null)
    setNombre("")
    setConfirmCancel(false)
  }

  return (
    <section id="cata" className="l-section l-cata" aria-labelledby="l-cata-titulo">
      <div>
        <h2 id="l-cata-titulo">Cata de los sábados</h2>
        <p>
          Noventa minutos con tres lotes de la barra, preparados en espresso y en filtrado. Aprendes
          a distinguir acidez, dulzor y cuerpo. {CUPO} lugares por sesión,{" "}
          <span className="l-num">{pesos(PRECIO_CATA)}</span> por persona, se paga en el local.
        </p>
      </div>
      {reserva ? (
        <div className="l-cata-done" tabIndex={-1} ref={resultRef} role="status">
          <h3>Lugar apartado</h3>
          <dl className="l-order-meta">
            <div>
              <dt>Código</dt>
              <dd className="l-num">{reserva.codigo}</dd>
            </div>
            <div>
              <dt>Cuándo</dt>
              <dd>
                {reserva.fecha}, {reserva.hora}
              </dd>
            </div>
            <div>
              <dt>Personas</dt>
              <dd className="l-num">{reserva.personas}</dd>
            </div>
          </dl>
          <p className="l-fiction">
            Reserva simulada a nombre de {reserva.nombre}. No se envió a ningún lugar ni se cobró.
          </p>
          {confirmCancel ? (
            <div className="l-confirm" role="group" aria-label="Confirmar cancelación">
              <p>¿Liberar {reserva.personas === 1 ? "el lugar" : "los lugares"}?</p>
              <div className="l-actions">
                <button type="button" className="l-button l-button-ink" onClick={cancelar}>
                  Sí, cancelar
                </button>
                <button
                  type="button"
                  className="l-button l-button-line"
                  onClick={() => setConfirmCancel(false)}
                >
                  Mantener la reserva
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="l-button l-button-line"
              onClick={() => setConfirmCancel(true)}
            >
              Cancelar la reserva
            </button>
          )}
        </div>
      ) : (
        <form className="l-cata-form" onSubmit={submit} noValidate>
          <fieldset disabled={sending} className="l-checkout-fields">
            <fieldset className="l-choice">
              <legend>Sábado</legend>
              <div>
                {fechas.map((f) => (
                  <label key={f.iso} className="l-pill">
                    <input
                      type="radio"
                      name="fecha"
                      value={f.iso}
                      checked={fecha === f.iso}
                      onChange={() => setFecha(f.iso)}
                    />
                    <span>{f.texto}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset className="l-choice">
              <legend>Hora</legend>
              <div>
                {HORARIOS_CATA.map((h) => (
                  <label key={h} className="l-pill">
                    <input
                      type="radio"
                      name="hora"
                      value={h}
                      checked={hora === h}
                      onChange={() => setHora(h)}
                    />
                    <span>
                      {h} <small>{disponibles(fecha, h)} lugares</small>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="l-cups">
              <span id="l-personas-label">Personas</span>
              <div className="l-stepper" role="group" aria-labelledby="l-personas-label">
                <button
                  type="button"
                  aria-label="Una persona menos"
                  disabled={personasValidas <= 1}
                  onClick={() => setPersonas(personasValidas - 1)}
                >
                  <Minus size={16} aria-hidden="true" />
                </button>
                <output aria-live="polite">{personasValidas}</output>
                <button
                  type="button"
                  aria-label="Una persona más"
                  disabled={personasValidas >= maxPersonas}
                  onClick={() => setPersonas(personasValidas + 1)}
                >
                  <Plus size={16} aria-hidden="true" />
                </button>
              </div>
            </div>
            <div className="l-field">
              <label htmlFor="l-cata-nombre">Nombre para la reserva</label>
              <input
                id="l-cata-nombre"
                name="nombre-reserva"
                ref={nameRef}
                value={nombre}
                maxLength={40}
                autoComplete="name"
                aria-invalid={error}
                aria-describedby={error ? "l-cata-error" : undefined}
                onChange={(event) => {
                  setNombre(event.target.value)
                  if (event.target.value.trim()) setError(false)
                }}
              />
              {error && (
                <p id="l-cata-error" className="l-error">
                  Escribe un nombre para apartar el lugar.
                </p>
              )}
            </div>
            <button type="submit" className="l-button l-button-cherry">
              {sending
                ? "Apartando lugar…"
                : `Apartar ${personasValidas} ${personasValidas === 1 ? "lugar" : "lugares"}`}
            </button>
          </fieldset>
        </form>
      )}
    </section>
  )
}

export default function Visitanos({ visitas, onCanjear, onWhatsApp }) {
  return (
    <>
      <section className="l-page-head" aria-labelledby="l-visitanos-titulo">
        <h1 id="l-visitanos-titulo" tabIndex={-1}>
          Visítanos
        </h1>
        <p className="l-lead">
          Un solo local en {LOCAL.zona}, {LOCAL.referencia}. El parque es solo una referencia: el
          local no existe.
        </p>
        <Foto id="ventana" priority className="l-head-photo l-head-photo-tall" sizes="100vw" />
      </section>
      <section className="l-section l-visit-grid" aria-label="Horario y tarjeta de visitas">
        <div>
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
          <p className="l-visit-note">{LOCAL.tueste}</p>
          <button type="button" className="l-button l-button-line" onClick={onWhatsApp}>
            <MessageCircle size={17} aria-hidden="true" />
            Escribir por WhatsApp
          </button>
        </div>
        <Tarjeta visitas={visitas} onCanjear={onCanjear} />
      </section>
      <Cata />
    </>
  )
}
