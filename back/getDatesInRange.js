function getDatesInRange(startDate, endDate) {
  const date = new Date(startDate.getTime());

  const dates = [];

  while (date <= endDate) {
    dates.push(new Date(date).toISOString().substring(0, 10));
    date.setDate(date.getDate() + 1);
  }

  return dates;
}

module.exports = getDatesInRange