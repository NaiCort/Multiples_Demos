import { useMemo } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { contourLines } from "../lib/contour"
import { metros } from "../data/lotes"

const EASE = [0.23, 1, 0.32, 1]
// Escala de tueste: del grano verde en lo bajo al tostado oscuro en lo alto.
// La cima lleva el color del lote (o la cereza en la portada).
const TUESTE = [
  "#E3E0C4",
  "#E8D3A8",
  "#E2BC88",
  "#D6A06A",
  "#C2834F",
  "#A8683F",
  "#8A4F33",
  "#6E3B26",
]
const DARK_FROM = 5

export default function ContourMap({
  lote,
  summit = lote.color,
  width = 600,
  height = 440,
  step = 50,
  className = "",
  slice = false,
  seed = lote.seed,
}) {
  const reduced = useReducedMotion()
  const lines = useMemo(
    () => contourLines({ seed, altitude: lote.altitud, width, height, step }),
    [seed, lote.altitud, width, height, step],
  )
  const last = lines.length - 1
  const tint = (index) =>
    index === last
      ? summit
      : TUESTE[Math.min(TUESTE.length - 1, Math.floor((index / last) * TUESTE.length))]
  const dark = (index) => index === last || Math.floor((index / last) * TUESTE.length) >= DARK_FROM
  // El relieve completo se colorea en menos de 1.2 s aunque tenga muchas curvas.
  const stagger = Math.min(0.05, 0.6 / Math.max(1, last))
  return (
    <svg
      className={`l-contour ${className}`}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio={slice ? "xMidYMid slice" : "xMidYMid meet"}
      role="img"
      aria-label={`Relieve ilustrativo de ${lote.finca}: una curva cada ${step} metros hasta ${metros(lote.altitud)}`}
    >
      <rect width={width} height={height} fill={TUESTE[0]} />
      {lines.map((line, index) => (
        <motion.path
          key={line.level}
          d={line.d}
          fill={tint(index)}
          stroke="#2A1E19"
          strokeOpacity={0.28}
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
          initial={reduced ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, delay: index * stagger, ease: EASE }}
        />
      ))}
      {lines.map((line, index) =>
        line.level % 200 === 0 &&
        index < last &&
        line.label.x > 24 &&
        line.label.x < width - 70 &&
        line.label.y > 20 &&
        line.label.y < height - 12 ? (
          <text
            key={line.level}
            x={line.label.x}
            y={line.label.y}
            className={`l-contour-label${dark(index) ? " is-dark" : ""}`}
          >
            {metros(line.level)}
          </text>
        ) : null,
      )}
    </svg>
  )
}
