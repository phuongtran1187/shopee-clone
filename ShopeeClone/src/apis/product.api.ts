import { Product, ProductList, ProductListConfig } from 'src/types/product.type'
import { ResponseSuccessApi } from 'src/types/utils.type'
import http from 'src/utils/http'

const URL = 'products'

const productApi = {
  getProducts(params: ProductListConfig) {
    return http.get<ResponseSuccessApi<ProductList>>(URL, {
      params
    })
  },
  getProduct(id: string) {
    return http.get<ResponseSuccessApi<Product>>(`${URL}/${id}`)
  }
}

export default productApi
