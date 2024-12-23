export function getDatesInRange(startDate, endDate) {
  const date = new Date(startDate.getTime())

  const dates = []
  let i = 0
  while (date <= endDate) {
    dates.push({ id: i, date: new Date(date).toISOString().substring(0, 10) })
    date.setDate(date.getDate() + 1)
    i++
  }

  return dates
}