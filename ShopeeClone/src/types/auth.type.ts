import { User } from './user.type'
import { ResponseSuccessApi } from './utils.type'

export type AuthResponse = ResponseSuccessApi<{
  access_token: string
  expires: string
  user: User
}>
