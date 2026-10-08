export function upcomingDates(today = new Date()) {
  const dates = []
  for (let offset = 1; dates.length < 6; offset++) {
    const day = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset, 12)
    if (day.getDay() === 1) continue // Lunes cerrado; no se ofrece una fecha que el local no atiende.
    const id = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`
    dates.push({ id, label: day.toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "short" }) })
  }
  return dates
}
export const reservationTimes = party => ["13:00", "14:30", "19:00", "20:30"].map(time => ({ time, available: Number(party) <= 4 || ["13:00", "19:00"].includes(time) }))
