export function luminance(hex) {
  const rgb = hex.replace("#", "").match(/.{2}/g).map(value => parseInt(value, 16) / 255)
  const [r, g, b] = rgb.map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrastRatio(a, b) {
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (values[0] + 0.05) / (values[1] + 0.05)
}

export function contrastingText(background = "#ffffff") {
  return contrastRatio(background, "#ffffff") >= 4.5 ? "#ffffff" : "#111318"
}

// Los colores de marca oscuros necesitan una variante para los diálogos.
export function dialogAccent(color = "#d8e5dc") {
  let rgb = color.replace("#", "").match(/.{2}/g).map(value => parseInt(value, 16))
  let result = color
  while (contrastRatio(result, "#16181d") < 4.5) {
    rgb = rgb.map(value => Math.min(255, value + 16))
    result = `#${rgb.map(value => value.toString(16).padStart(2, "0")).join("")}`
  }
  return result
}
