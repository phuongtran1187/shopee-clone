export interface ResponseSuccessApi<Data> {
  message: string
  data: Data
}

export interface ResponseErrorApi<Data> {
  message: string
  data?: Data
}
