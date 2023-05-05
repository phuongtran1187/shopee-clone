import { Purchase, PurchaseListStatus } from 'src/types/purchase.type'
import { ResponseSuccessApi } from 'src/types/utils.type'
import http from 'src/utils/http'

const URL = 'purchases'

const purchaseApi = {
  addToCart(body: { product_id: string; buy_count: number }) {
    return http.post<ResponseSuccessApi<Purchase>>(`${URL}/add-to-cart`, body)
  },
  readPurchase(params: { status: PurchaseListStatus }) {
    return http.get<ResponseSuccessApi<Purchase[]>>(`${URL}`, {
      params
    })
  }
}

export default purchaseApi
