export interface ResponseSuccessApi<Data> {
  message: string
  data: Data
}

export interface ResponseErrorApi<Data> {
  message: string
  data?: Data
}

// cú pháp '-?' sẽ loại bỏ undefined của key optional
export type NoUndefined<T> = {
  [P in keyof T]-?: NoUndefined<NonNullable<T[P]>>
}
