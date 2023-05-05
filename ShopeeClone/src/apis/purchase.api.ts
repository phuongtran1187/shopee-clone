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
  },
  buyPurchases(body: { product_id: string; buy_count: number }[]) {
    return http.post<ResponseSuccessApi<Purchase[]>>(`${URL}/buy-products`, body)
  },
  updatePurchases(body: { product_id: string; buy_count: number }) {
    return http.put<ResponseSuccessApi<Purchase>>(`${URL}/update-purchase`, body)
  },
  deletePurchase(purchasesIds: string[]) {
    return http.delete<ResponseSuccessApi<{ delete_count: number }>>(`${URL}`, {
      data: purchasesIds
    })
  }
}

export default purchaseApi
