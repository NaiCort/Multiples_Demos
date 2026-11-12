import ContourMap from "./ContourMap"
import { metros, pesos, puntos } from "../data/lotes"

export default function LoteSheet({ lote, headingId }) {
  const rows = [
    ["Productor", lote.productor],
    ["Finca", `${lote.finca}, ${lote.municipio}`],
    ["Altitud", metros(lote.altitud)],
    ["Variedad", lote.variedad],
    ["Proceso", lote.proceso],
    ["Notas de taza", lote.notas.join(", ")],
    ["Puntaje de cata", puntos(lote.puntaje)],
    ["Pagado al productor", `${pesos(lote.pagadoKg)} por kg de café verde`],
    ["Bolsa de 250 g", pesos(lote.precio250)],
  ]
  return (
    <article className="l-sheet" style={{ "--lote": lote.color }} aria-labelledby={headingId}>
      <ContourMap lote={lote} className="l-sheet-map" />
      <div className="l-sheet-body">
        <h3 id={headingId} className="l-sheet-title">
          {lote.nombre}
        </h3>
        <dl className="l-sheet-data">
          {rows.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  )
}
