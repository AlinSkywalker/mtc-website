import { toString } from 'lodash-es'
import { format, isValid } from 'date-fns'

export const formatDateValue = (value, dateFormat) => {
  const isUTC = toString(value).slice(-5) === '[UTC]'
  const date = isUTC ? new Date(toString(value).slice(0, -5)) : new Date(value)
  return isValid(date) ? format(date, dateFormat) : value
}
