import axios, { AxiosError, InternalAxiosRequestConfig, type AxiosInstance } from 'axios'
import { toast } from 'react-toastify'
import { AuthResponse, RefreshTokenResponse } from 'src/types/auth.type'
import httpStatusCode from 'src/constants/httpStatusCode.enum'
import {
  getAccessTokenFromLS,
  getRefreshTokenFromLS,
  removeLS,
  setAccessTokenToLS,
  setProfileToLS,
  setRefreshTokenToLS
} from './auth'
import config from 'src/constants/config'
import { URL_LOGIN, URL_LOGOUT, URL_REFRESH_TOKEN, URL_REGISTER } from 'src/apis/auth.api'
import { isExpiredTokenError, isUnauthorizedError } from './utils'
import { ResponseErrorApi } from 'src/types/utils.type'

class Http {
  instance: AxiosInstance
  private accessToken: string
  private refreshToken: string
  private refreshTokenRequest: Promise<string> | null
  constructor() {
    this.accessToken = getAccessTokenFromLS()
    this.refreshToken = getRefreshTokenFromLS()
    this.refreshTokenRequest = null
    this.instance = axios.create({
      baseURL: config.baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'expire-access-token': 10,
        'expire-refresh-token': 60 * 60
      }
    })
    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.Authorization = this.accessToken
          return config
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
    this.instance.interceptors.response.use(
      (response) => {
        const config = response.config
        if (config.url === URL_LOGIN || config.url === URL_REGISTER) {
          const data = response.data as AuthResponse
          this.accessToken = data.data.access_token
          this.refreshToken = data.data.refresh_token
          setAccessTokenToLS(this.accessToken)
          setRefreshTokenToLS(this.refreshToken)
          setProfileToLS(data.data.user)
        } else if (config.url === URL_LOGOUT) {
          this.accessToken = ''
          this.refreshToken = ''
          removeLS()
        }
        return response
      },
      (error: AxiosError) => {
        if (
          ![httpStatusCode.UnprocessableEntity, httpStatusCode.Unauthorized].includes(error.response?.status as number)
        ) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data: any | undefined = error.response?.data
          const message = data?.message || error.message
          toast.error(message)
        }
        // Nếu là lỗi 401
        if (isUnauthorizedError<ResponseErrorApi<{ name: string; message: string }>>(error)) {
          const config = error.response?.config || ({ headers: {} } as InternalAxiosRequestConfig)
          const { url } = config
          if (isExpiredTokenError(error) && url !== URL_REFRESH_TOKEN) {
            this.refreshTokenRequest = this.refreshTokenRequest
              ? this.refreshTokenRequest
              : this.handleRefreshToken().finally(() =>
                  setTimeout(() => {
                    this.refreshTokenRequest = null
                  }, 5000)
                )
            return this.refreshTokenRequest.then((access_token) => {
              // config.headers.Authorization = access_token
              // Gọi lại cú pháp cũ vừa bị lỗi
              return this.instance({ ...config, headers: { ...config.headers, Authorization: access_token } })
            })
          }
          removeLS()
          this.accessToken = ''
          this.refreshToken = ''
          // toast.error(error.response?.data?.message)
        }
        return Promise.reject(error)
      }
    )
  }
  private handleRefreshToken() {
    return this.instance
      .post<RefreshTokenResponse>(URL_REFRESH_TOKEN, {
        refresh_token: this.refreshToken
      })
      .then((res) => {
        const { access_token } = res.data.data
        setAccessTokenToLS(access_token)
        this.accessToken = access_token
        return access_token
      })
      .catch((err) => {
        removeLS()
        this.accessToken = ''
        this.refreshToken = ''
        throw err
      })
  }
}

const http = new Http().instance

export default http
