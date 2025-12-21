export const getFormattedNumber = (number) => {
  return number
    ? new Intl.NumberFormat('ru', { style: 'currency', currency: 'RUB' }).format(number)
    : ''
}
