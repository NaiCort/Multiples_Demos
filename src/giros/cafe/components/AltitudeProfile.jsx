import { motion, useReducedMotion } from "framer-motion"
import { metros } from "../data/lotes"

const W = 720
const H = 300
const PAD = { left: 64, right: 24, top: 24, bottom: 36 }
const MIN = 1000
const MAX = 1600

const y = (alt) => PAD.top + ((MAX - alt) / (MAX - MIN)) * (H - PAD.top - PAD.bottom)

// Perfil de ladera: los lotes se ordenan por altitud sobre una misma pendiente.
export default function AltitudeProfile({ lotes }) {
  const reduced = useReducedMotion()
  const sorted = [...lotes].sort((a, b) => a.altitud - b.altitud)
  const step = (W - PAD.left - PAD.right) / (sorted.length + 1)
  const points = sorted.map((lote, index) => ({
    lote,
    x: PAD.left + step * (index + 1),
    y: y(lote.altitud),
  }))
  const base = H - PAD.bottom
  const r = (n) => Math.round(n * 10) / 10
  const first = points[0]
  const last = points.at(-1)
  const path = [
    `M${PAD.left} ${base}`,
    `C${r(PAD.left + step * 0.5)} ${base} ${r(first.x - step * 0.5)} ${r(first.y + 40)} ${r(first.x)} ${r(first.y)}`,
    ...points.slice(1).map((p) => `S${r(p.x - step * 0.5)} ${r(p.y)} ${r(p.x)} ${r(p.y)}`),
    `S${r(W - PAD.right - step * 0.2)} ${r(last.y - 10)} ${W - PAD.right} ${r(last.y + 24)}`,
  ].join(" ")
  const grid = []
  for (let alt = MIN; alt <= MAX; alt += 100) grid.push(alt)
  return (
    <svg
      className="l-profile"
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={`Altitud de los lotes: ${sorted.map((l) => `${l.nombre} ${metros(l.altitud)}`).join(", ")}`}
    >
      {grid.map((alt) => (
        <g key={alt}>
          <line x1={PAD.left} x2={W - PAD.right} y1={y(alt)} y2={y(alt)} className="l-grid" />
          <text x={PAD.left - 10} y={y(alt) + 4} textAnchor="end" className="l-axis">
            {metros(alt)}
          </text>
        </g>
      ))}
      <motion.path
        d={path}
        className="l-slope"
        initial={reduced ? false : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.1, ease: [0.23, 1, 0.32, 1] }}
      />
      {points.map(({ lote, x, y: py }) => (
        <g key={lote.id}>
          <rect x={x - 6} y={py - 6} width="12" height="12" fill={lote.color} />
          <text x={x} y={py - 34} textAnchor="middle" className="l-point-name">
            {lote.nombre}
          </text>
          <text x={x} y={py - 15} textAnchor="middle" className="l-axis l-point-alt">
            {metros(lote.altitud)}
          </text>
        </g>
      ))}
    </svg>
  )
}
