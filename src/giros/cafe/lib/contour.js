// Curvas de nivel ilustrativas de cada lote. No representan un terreno real: se
// generan a partir de una semilla fija, así que el mismo lote dibuja siempre la misma
// ladera, y el número de curvas crece con su altitud (una cada `step` metros, 50 por omisión).

function seeded(seed) {
  let state = seed >>> 0
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    return state / 4294967296
  }
}

const round = (value) => Math.round(value * 10) / 10

function closedCurve(points) {
  const at = (index) => points[(index + points.length) % points.length]
  let d = `M${round(points[0][0])} ${round(points[0][1])}`
  for (let i = 0; i < points.length; i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)]
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += `C${round(c1[0])} ${round(c1[1])} ${round(c2[0])} ${round(c2[1])} ${round(p2[0])} ${round(p2[1])}`
  }
  return `${d}Z`
}

export function contourLevels(altitude, base = 800, step = 50) {
  const levels = []
  for (let level = Math.ceil(base / step) * step; level <= altitude; level += step)
    levels.push(level)
  return levels
}

export function contourLines({ seed, altitude, width = 600, height = 440, base, step }) {
  const random = seeded(seed)
  const levels = contourLevels(altitude, base, step)
  const peak = {
    x: width * (0.58 + (random() - 0.5) * 0.24),
    y: height * (0.44 + (random() - 0.5) * 0.2),
  }
  const harmonics = [2, 3, 5, 7].map((k, index) => ({
    k,
    amp: (0.07 + random() * 0.07) / (index + 1),
    phase: random() * Math.PI * 2,
  }))
  const outer = Math.hypot(width, height) * 0.52
  const samples = 56
  return levels.map((level, index) => {
    const t = levels.length === 1 ? 1 : index / (levels.length - 1)
    const radius = outer * (1 - t) * 0.92 + 18
    const cx = width / 2 + (peak.x - width / 2) * t
    const cy = height / 2 + (peak.y - height / 2) * t
    const points = []
    for (let i = 0; i < samples; i++) {
      const angle = (i / samples) * Math.PI * 2
      const wobble = harmonics.reduce(
        (sum, h) => sum + h.amp * (1 - 0.4 * t) * Math.sin(h.k * angle + h.phase + index * 0.3),
        0,
      )
      const r = radius * (1 + wobble)
      points.push([cx + Math.cos(angle) * r, cy + Math.sin(angle) * r * 0.82])
    }
    const label = points[Math.round(samples * 0.62)]
    return { level, d: closedCurve(points), label: { x: round(label[0]), y: round(label[1]) } }
  })
}
