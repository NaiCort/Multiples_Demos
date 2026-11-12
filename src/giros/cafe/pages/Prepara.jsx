import { useState } from "react"
import { Minus, Plus } from "lucide-react"
import BrewTimer from "../components/BrewTimer"
import { findItem } from "../data/carta"
import { GUIAS } from "../data/guias"
import { LOTE_SEMANA } from "../data/lotes"
import { ratio, scaled } from "../state/guia"

export default function Prepara({ onChoose }) {
  const [guiaId, setGuiaId] = useState(GUIAS[0].id)
  const guia = GUIAS.find((item) => item.id === guiaId)
  const [tazasPorGuia, setTazasPorGuia] = useState({})
  const tazas = tazasPorGuia[guia.id] ?? guia.tazas.base
  const setTazas = (value) => setTazasPorGuia((previous) => ({ ...previous, [guia.id]: value }))
  const receta = scaled(guia, tazas)
  const datos = [
    ["Café", `${receta.cafe} g`],
    ["Agua", `${receta.agua} g`],
    ["Proporción", ratio(receta.cafe, receta.agua)],
    ["Molienda", guia.grano],
    ["Temperatura", guia.temperatura ? `${guia.temperatura} °C` : "Agua ya caliente, fuego medio"],
    ["Tiempo total", `${Math.round(guia.fin / 6) / 10} min`],
  ]
  return (
    <>
      <section className="l-page-head" aria-labelledby="l-prepara-titulo">
        <h1 id="l-prepara-titulo" tabIndex={-1}>
          Prepara en casa
        </h1>
        <p className="l-lead">
          Las mismas recetas que usamos en barra, con un temporizador que te dice cuándo verter. Una
          báscula de cocina ayuda más que cualquier otro accesorio.
        </p>
      </section>

      <section className="l-section l-brew" aria-labelledby="l-metodo-titulo">
        <h2 id="l-metodo-titulo" className="l-sr-only">
          Método y receta
        </h2>
        <fieldset className="l-methods">
          <legend>Método</legend>
          {GUIAS.map((item) => (
            <label key={item.id} className="l-pill">
              <input
                type="radio"
                name="metodo"
                value={item.id}
                checked={item.id === guia.id}
                onChange={() => setGuiaId(item.id)}
              />
              <span>{item.nombre}</span>
            </label>
          ))}
        </fieldset>
        <div className="l-brew-grid">
          <div>
            <p className="l-brew-desc">{guia.descripcion}</p>
            {guia.tazas.max > 1 && (
              <div className="l-cups">
                <span id="l-tazas-label">Tazas</span>
                <div className="l-stepper" role="group" aria-labelledby="l-tazas-label">
                  <button
                    type="button"
                    aria-label="Una taza menos"
                    disabled={tazas <= 1}
                    onClick={() => setTazas(tazas - 1)}
                  >
                    <Minus size={16} aria-hidden="true" />
                  </button>
                  <output aria-live="polite">{tazas}</output>
                  <button
                    type="button"
                    aria-label="Una taza más"
                    disabled={tazas >= guia.tazas.max}
                    onClick={() => setTazas(tazas + 1)}
                  >
                    <Plus size={16} aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}
            <dl className="l-recipe">
              {datos.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <button
              type="button"
              className="l-button l-button-cherry l-brew-buy"
              onClick={() =>
                onChoose(findItem(`bolsa-${LOTE_SEMANA.id}`), { molienda: guia.molienda })
              }
            >
              Comprar {LOTE_SEMANA.nombre} molido para {guia.nombre}
            </button>
          </div>
          <BrewTimer key={`${guia.id}-${tazas}`} guia={guia} receta={receta} />
        </div>
      </section>
    </>
  )
}
