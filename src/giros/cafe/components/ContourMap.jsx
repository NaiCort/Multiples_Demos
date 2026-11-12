import { useMemo } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { contourLines } from "../lib/contour"
import { metros } from "../data/lotes"

const WIDTH = 600
const HEIGHT = 440
const EASE = [0.23, 1, 0.32, 1]

export default function ContourMap({ lote, className = "" }) {
  const reduced = useReducedMotion()
  const lines = useMemo(
    () => contourLines({ seed: lote.seed, altitude: lote.altitud, width: WIDTH, height: HEIGHT }),
    [lote.seed, lote.altitud],
  )
  const last = lines.length - 1
  // El trazo completo no pasa de 1.2 s aunque el lote tenga muchas curvas.
  const stagger = Math.min(0.05, 0.3 / Math.max(1, last))
  return (
    <svg
      className={`l-contour ${className}`}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label={`Curvas de nivel ilustrativas de ${lote.finca}, hasta ${metros(lote.altitud)}`}
    >
      {lines.map((line, index) => (
        <motion.path
          key={line.level}
          d={line.d}
          fill="none"
          stroke={index === last ? lote.color : "currentColor"}
          strokeWidth={index === last ? 2.4 : 1}
          strokeOpacity={index === last ? 1 : 0.28 + (0.5 * index) / Math.max(1, last)}
          vectorEffect="non-scaling-stroke"
          initial={reduced ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.85, delay: index * stagger, ease: EASE }}
        />
      ))}
      {lines.map((line, index) =>
        line.level % 100 === 0 &&
        (last - index) % 4 < 2 &&
        line.label.x > 24 &&
        line.label.x < WIDTH - 70 &&
        line.label.y > 20 &&
        line.label.y < HEIGHT - 12 ? (
          <text key={line.level} x={line.label.x} y={line.label.y} className="l-contour-label">
            {metros(line.level)}
          </text>
        ) : null,
      )}
    </svg>
  )
}
