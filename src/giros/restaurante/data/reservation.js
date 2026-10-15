export function upcomingDates(today = new Date(), timeZone = "America/Mexico_City") {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(today).map(part => [part.type, part.value]))
  const localDay = Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day), 12)
  const dates = []
  for (let offset = 1; dates.length < 6; offset++) {
    const day = new Date(localDay + offset * 86_400_000)
    if (day.getUTCDay() === 1) continue
    const id = day.toISOString().slice(0, 10)
    dates.push({ id, label: day.toLocaleDateString("es-MX", { timeZone: "UTC", weekday: "long", day: "numeric", month: "short" }) })
  }
  return dates
}
export const reservationTimes = party => ["13:00", "14:30", "19:00", "20:30"].map(time => ({ time, available: Number(party) <= 4 || ["13:00", "19:00"].includes(time) }))
