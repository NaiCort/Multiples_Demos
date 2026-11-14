import { useEffect, useMemo, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { Minus, Plus, Trash2 } from "lucide-react"
import Steam from "../components/Steam"
import { findItem } from "../data/carta"
import { pesos } from "../data/lotes"
import {
  ETAPAS,
  MAX_CANTIDAD,
  cartTotal,
  describeConfig,
  pickupSlots,
  stageAt,
  unitPrice,
} from "../state/pedido"

function Lines({ lines, onQuantity, onRemove }) {
  return (
    <ul className="l-lines">
      {lines.map((row) => {
        const item = findItem(row.itemId)
        if (!item) return null
        const detalle = describeConfig(item, row.config)
        return (
          <li key={row.id}>
            <div>
              <strong>{item.nombre}</strong>
              {detalle && <span>{detalle}</span>}
            </div>
            {onQuantity ? (
              <div className="l-stepper" role="group" aria-label={`Cantidad de ${item.nombre}`}>
                <button
                  type="button"
                  aria-label={`Quitar un ${item.nombre}`}
                  disabled={row.cantidad <= 1}
                  onClick={() => onQuantity(row.id, row.cantidad - 1)}
                >
                  <Minus size={16} aria-hidden="true" />
                </button>
                <output>{row.cantidad}</output>
                <button
                  type="button"
                  aria-label={`Agregar un ${item.nombre}`}
                  disabled={row.cantidad >= MAX_CANTIDAD}
                  onClick={() => onQuantity(row.id, row.cantidad + 1)}
                >
                  <Plus size={16} aria-hidden="true" />
                </button>
              </div>
            ) : (
              <span className="l-num">× {row.cantidad}</span>
            )}
            <span className="l-num l-line-price">
              {pesos(unitPrice(item, row.config) * row.cantidad)}
            </span>
            {onRemove && (
              <button
                type="button"
                className="l-icon-button"
                aria-label={`Eliminar ${item.nombre} del pedido`}
                onClick={() => onRemove(row.id)}
              >
                <Trash2 size={17} aria-hidden="true" />
              </button>
            )}
          </li>
        )
      })}
    </ul>
  )
}

function Seguimiento({ order, onPickup, onReset }) {
  const [now, setNow] = useState(() => Date.now())
  const stage = stageAt(order, now)
  const ready = stage.id === "lista"
  const statusRef = useRef(null)
  useEffect(() => {
    if (ready) return undefined
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [ready])
  useEffect(() => {
    if (ready) statusRef.current?.focus({ preventScroll: true })
  }, [ready])
  if (order.status === "recogido")
    return (
      <div className="l-order-done" tabIndex={-1} ref={statusRef}>
        <h2>Gracias, {order.nombre}.</h2>
        <p>
          Recorrido completo. En un café real, aquí terminaría la visita; esta demo no cobró ni
          envió nada.
        </p>
        <div className="l-actions">
          <button type="button" className="l-button l-button-ink" onClick={onReset}>
            Hacer otro pedido
          </button>
          <Link className="l-button l-button-line" to="/cafe">
            Volver al inicio
          </Link>
        </div>
      </div>
    )
  const current = ETAPAS.indexOf(stage)
  return (
    <div className="l-tracking">
      <dl className="l-order-meta">
        <div>
          <dt>Pedido</dt>
          <dd className="l-num">{order.numero}</dd>
        </div>
        <div>
          <dt>Nombre en el vaso</dt>
          <dd>{order.nombre}</dd>
        </div>
        <div>
          <dt>Recoger</dt>
          <dd>{order.hora}</dd>
        </div>
      </dl>
      <ol className="l-stages" aria-label="Estado del pedido">
        {ETAPAS.map((etapa, index) => (
          <li
            key={etapa.id}
            className={index < current ? "is-done" : index === current ? "is-current" : ""}
            aria-current={index === current ? "step" : undefined}
          >
            {etapa.nombre}
          </li>
        ))}
      </ol>
      <div className="l-ready" role="status" tabIndex={-1} ref={statusRef}>
        {ready ? (
          <>
            <Steam />
            <p>
              <strong>Tu pedido está listo.</strong> Pregunta en barra por «{order.nombre}».
            </p>
          </>
        ) : (
          <p>
            Simulación acelerada: el pedido pasa por la barra en un minuto. En un café real, estaría
            listo para la hora que elegiste.
          </p>
        )}
      </div>
      <Lines lines={order.lines} />
      <p className="l-total">
        Total a pagar en caja <span className="l-num">{pesos(order.total)}</span>
      </p>
      <div className="l-actions">
        {ready && (
          <button type="button" className="l-button l-button-cherry" onClick={onPickup}>
            Ya lo recogí
          </button>
        )}
        <Link className="l-button l-button-line" to="/cafe/carta">
          Ver la carta
        </Link>
      </div>
    </div>
  )
}

export default function Pedido({ state, dispatch, onPrivacy }) {
  const { cart, order } = state
  const slots = useMemo(() => pickupSlots(new Date()), [])
  const [nombre, setNombre] = useState("")
  const [hora, setHora] = useState(slots[0]?.texto || "")
  const [error, setError] = useState(false)
  const [sending, setSending] = useState(false)
  const [removed, setRemoved] = useState(null)
  const timer = useRef(null)
  const nameRef = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])
  const confirmed = order?.numero
  useEffect(() => {
    if (!confirmed) return
    const heading = document.getElementById("l-pedido-titulo")
    heading?.scrollIntoView({ block: "start" })
    heading?.focus({ preventScroll: true })
  }, [confirmed])
  const submit = (event) => {
    event.preventDefault()
    if (!nombre.trim()) {
      setError(true)
      nameRef.current?.focus()
      return
    }
    setSending(true)
    timer.current = setTimeout(() => {
      const now = Date.now()
      dispatch({ type: "confirm", nombre, hora, now, numero: `L-${String(now).slice(-3)}` })
      setSending(false)
    }, 800)
  }
  return (
    <section className="l-page-head l-order" aria-labelledby="l-pedido-titulo">
      <h1 id="l-pedido-titulo" tabIndex={-1}>
        {order ? "Tu pedido" : "Pedido para recoger"}
      </h1>
      <div aria-live="polite">
        {removed && !order && (
          <p className="l-undo">
            Quitaste {findItem(removed.row.itemId)?.nombre} del pedido.{" "}
            <button
              type="button"
              onClick={() => {
                dispatch({ type: "restore", ...removed })
                setRemoved(null)
              }}
            >
              Deshacer
            </button>
          </p>
        )}
      </div>
      {order ? (
        <Seguimiento
          order={order}
          onPickup={() => dispatch({ type: "pickup" })}
          onReset={() => dispatch({ type: "reset" })}
        />
      ) : cart.length === 0 ? (
        <div className="l-empty">
          <p>Tu pedido está vacío. Elige algo de la carta y aquí escoges la hora para recogerlo.</p>
          <Link className="l-button l-button-ink" to="/cafe/carta">
            Ir a la carta
          </Link>
        </div>
      ) : (
        <form className="l-checkout" onSubmit={submit} noValidate>
          <Lines
            lines={cart}
            onQuantity={(id, cantidad) => dispatch({ type: "quantity", id, cantidad })}
            onRemove={(id) => {
              const index = cart.findIndex((row) => row.id === id)
              setRemoved({ row: cart[index], index })
              dispatch({ type: "remove", id })
            }}
          />
          <p className="l-total">
            Total <span className="l-num">{pesos(cartTotal(cart))}</span>
          </p>
          <fieldset disabled={sending} className="l-checkout-fields">
            <div className="l-field">
              <label htmlFor="l-nombre">Nombre para el vaso</label>
              <input
                id="l-nombre"
                name="nombre-vaso"
                ref={nameRef}
                value={nombre}
                maxLength={24}
                autoComplete="given-name"
                aria-invalid={error}
                aria-describedby={error ? "l-nombre-error" : undefined}
                onChange={(event) => {
                  setNombre(event.target.value)
                  if (event.target.value.trim()) setError(false)
                }}
              />
              {error && (
                <p id="l-nombre-error" className="l-error">
                  Escribe un nombre para que la barra sepa de quién es el pedido.
                </p>
              )}
            </div>
            <div className="l-field">
              <label htmlFor="l-hora">Hora para recoger</label>
              {slots.length > 0 ? (
                <select
                  id="l-hora"
                  name="hora"
                  value={hora}
                  onChange={(event) => setHora(event.target.value)}
                >
                  {slots.map((slot) => (
                    <option key={slot.id} value={slot.texto}>
                      {slot.pronto ? `Lo antes posible (${slot.texto.toLowerCase()})` : slot.texto}
                    </option>
                  ))}
                </select>
              ) : (
                <p>No hay horarios disponibles esta semana.</p>
              )}
            </div>
            <p className="l-fiction">
              Pago al recoger, en caja. Esta demo no cobra, no envía el pedido y no guarda tu nombre
              fuera de este navegador.{" "}
              <button type="button" className="l-inline-link" onClick={onPrivacy}>
                Aviso de privacidad
              </button>
            </p>
            <button
              type="submit"
              className="l-button l-button-cherry"
              disabled={sending || slots.length === 0}
            >
              {sending ? "Enviando a la barra…" : "Confirmar pedido"}
            </button>
          </fieldset>
          <Link className="l-text-link" to="/cafe/carta">
            Seguir viendo la carta
          </Link>
        </form>
      )}
    </section>
  )
}
