import { AuthResponse } from 'src/types/auth.type'
import http from 'src/utils/http'

export const URL_LOGIN = 'login'
export const URL_REGISTER = 'register'
export const URL_LOGOUT = 'logout'
export const URL_REFRESH_TOKEN = 'refresh-access-token'

export const resgisterAccount = (body: { email: string; password: string }) =>
  http.post<AuthResponse>(URL_REGISTER, body)

export const loginAccount = (body: { email: string; password: string }) => http.post<AuthResponse>(URL_LOGIN, body)

export const logoutAccount = () => http.post(URL_LOGOUT)
