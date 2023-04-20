import { Category } from 'src/types/category.type'
import { ResponseSuccessApi } from 'src/types/utils.type'
import http from 'src/utils/http'

const URL = 'categories'

const categoryApi = {
  getCategories() {
    return http.get<ResponseSuccessApi<Category[]>>(URL)
  }
}

export default categoryApi
