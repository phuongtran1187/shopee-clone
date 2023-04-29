import axios, { AxiosError } from 'axios'
import httpStatusCode from 'src/constants/httpStatusCode.enum'

export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  // eslint-disable-next-line import/no-named-as-default-member
  return axios.isAxiosError(error)
}

export function isUnprocessableEntityError<FormError>(error: unknown): error is AxiosError<FormError> {
  return isAxiosError(error) && error.response?.status === httpStatusCode.UnprocessableEntity
}

export function formatCurency(curency: number) {
  return new Intl.NumberFormat('de-DE').format(curency)
}

export function formatShortNumber(number: number) {
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumSignificantDigits: 1 })
    .format(number)
    .replace('.', ',')
    .toLowerCase()
}

export function rateSale(originalPrice: number, salePrice: number) {
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100) + '%'
}

const removeSpecialCharacter = (str: string) =>
  // eslint-disable-next-line no-useless-escape
  str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, '')

export const generateNameId = ({ name, id }: { name: string; id: string }) => {
  return removeSpecialCharacter(name).replace(/\s/g, '-') + `-i-${id}`
}

export const getIdFromNameId = (nameId: string) => {
  const arr = nameId.split('-i-')
  return arr[arr.length - 1]
}
