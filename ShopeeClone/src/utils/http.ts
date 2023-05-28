import axios, { AxiosError, type AxiosInstance } from 'axios'
import { toast } from 'react-toastify'
import { AuthResponse } from 'src/types/auth.type'
import httpStatusCode from 'src/constants/httpStatusCode.enum'
import { getAccessTokenFromLS, removeLS, setAccessTokenToLS, setProfileToLS } from './auth'
import { path } from 'src/constants/path'
import config from 'src/constants/config'

class Http {
  instance: AxiosInstance
  private accessToken: string
  constructor() {
    this.accessToken = getAccessTokenFromLS()
    this.instance = axios.create({
      baseURL: config.baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
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
        if (config.url === path.login || config.url === path.register) {
          const data = response.data as AuthResponse
          this.accessToken = data.data.access_token
          setAccessTokenToLS(this.accessToken)
          setProfileToLS(data.data.user)
        } else if (config.url === path.logout) {
          this.accessToken = ''
          removeLS()
        }
        return response
      },
      function (error: AxiosError) {
        if (error.response?.status !== httpStatusCode.UnprocessableEntity) {
          const data: any | undefined = error.response?.data
          const message = data?.message || error.message
          toast.error(message)
        }
        if (error.response?.status === httpStatusCode.Unauthorized) {
          removeLS()
        }
        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance

export default http
