import { User } from 'src/types/user.type'
import { ResponseSuccessApi } from 'src/types/utils.type'
import http from 'src/utils/http'

interface UpdateProfileType extends Omit<User, '_id' | 'roles' | 'email' | 'createdAt' | 'updatedAt'> {
  password?: string
  newPassword?: string
}

const userApi = {
  getUser: () => {
    return http.get<ResponseSuccessApi<User>>('me')
  },
  updateUser: (body: UpdateProfileType) => {
    return http.put<ResponseSuccessApi<User>>('user', body)
  },
  uploadAvatar: (body: FormData) => {
    return http.post<ResponseSuccessApi<string>>('user/upload-avatar', body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

export default userApi
