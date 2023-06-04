import { User } from './user.type'
import { ResponseSuccessApi } from './utils.type'

export type AuthResponse = ResponseSuccessApi<{
  access_token: string
  expires: number
  refresh_token: string
  expires_refresh_token: number
  user: User
}>

export type RefreshTokenResponse = ResponseSuccessApi<{ access_token: string }>
