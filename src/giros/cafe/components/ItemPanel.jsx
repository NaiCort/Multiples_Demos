import { useState } from "react"
import { Minus, Plus } from "lucide-react"
import Modal from "../../../components/shared/Modal"
import { AZUCAR, LECHES, SHOT_EXTRA } from "../data/carta"
import { LOTES, metros, pesos } from "../data/lotes"
import { MAX_CANTIDAD, defaultConfig, unitPrice } from "../state/pedido"

function Choice({ legend, name, options, value, onChange }) {
  return (
    <fieldset className="l-choice">
      <legend>{legend}</legend>
      <div>
        {options.map((option) => (
          <label key={option.value} className="l-pill">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function Stepper({ label, value, min, max, onChange, format = (n) => n }) {
  return (
    <div className="l-stepper" role="group" aria-label={label}>
      <button
        type="button"
        aria-label={`Quitar uno de ${label.toLowerCase()}`}
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
      >
        <Minus size={16} aria-hidden="true" />
      </button>
      <output aria-live="polite">{format(value)}</output>
      <button
        type="button"
        aria-label={`Agregar uno de ${label.toLowerCase()}`}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        <Plus size={16} aria-hidden="true" />
      </button>
    </div>
  )
}

export default function ItemPanel({ item, onAdd, onClose }) {
  const [config, setConfig] = useState(() => defaultConfig(item))
  const [cantidad, setCantidad] = useState(1)
  const set = (key) => (value) => setConfig((previous) => ({ ...previous, [key]: value }))
  const total = unitPrice(item, config) * cantidad
  return (
    <Modal title={item.nombre} onClose={onClose} className="ladera-modal" radius={2}>
      <p className="l-modal-desc">{item.desc}</p>
      <form
        className="l-item-form"
        onSubmit={(event) => {
          event.preventDefault()
          onAdd({ itemId: item.id, config, cantidad })
        }}
      >
        {config.lote && (
          <Choice
            legend="Lote"
            name="lote"
            value={config.lote}
            onChange={set("lote")}
            options={LOTES.map((lote) => ({
              value: lote.id,
              label: (
                <>
                  <i className="l-swatch" style={{ "--lote": lote.color }} />
                  {lote.nombre} <small>{metros(lote.altitud)}</small>
                </>
              ),
            }))}
          />
        )}
        {config.leche && (
          <Choice
            legend="Leche"
            name="leche"
            value={config.leche}
            onChange={set("leche")}
            options={LECHES.map((leche) => ({
              value: leche.id,
              label: leche.extra ? `${leche.nombre} +$${leche.extra}` : leche.nombre,
            }))}
          />
        )}
        {"shots" in config && (
          <div className="l-choice">
            <p className="l-choice-label">Shot extra (+${SHOT_EXTRA} cada uno)</p>
            <Stepper
              label="Shots extra"
              value={config.shots}
              min={0}
              max={2}
              onChange={set("shots")}
            />
          </div>
        )}
        {config.azucar && (
          <Choice
            legend="Azúcar"
            name="azucar"
            value={config.azucar}
            onChange={set("azucar")}
            options={AZUCAR.map((nivel) => ({ value: nivel, label: nivel }))}
          />
        )}
        <div className="l-item-footer">
          <Stepper
            label="Cantidad"
            value={cantidad}
            min={1}
            max={MAX_CANTIDAD}
            onChange={setCantidad}
          />
          <button type="submit" className="l-button l-button-cherry">
            Agregar · <span className="l-num">{pesos(total)}</span>
          </button>
        </div>
      </form>
    </Modal>
  )
}
