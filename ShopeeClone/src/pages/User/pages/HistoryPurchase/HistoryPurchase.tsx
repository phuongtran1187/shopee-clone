import { useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, createSearchParams } from 'react-router-dom'
import purchaseApi from 'src/apis/purchase.api'
import { path } from 'src/constants/path'
import { purchasesStatus } from 'src/constants/purchase'
import useQueryParams from 'src/hooks/useQueryParams'
import { PurchaseListStatus } from 'src/types/purchase.type'
import { formatCurency, generateNameId } from 'src/utils/utils'

const purchaseTabs = [
  { status: purchasesStatus.all, name: 'Tất cả' },
  { status: purchasesStatus.waitForConfirmation, name: 'Chờ xác nhận' },
  { status: purchasesStatus.waitForGetting, name: 'Chờ lấy hàng' },
  { status: purchasesStatus.inProgress, name: 'Đang giao' },
  { status: purchasesStatus.delivered, name: 'Đã giao' },
  { status: purchasesStatus.cancelled, name: 'Đã hủy' }
]

export default function HistoryPurchase() {
  const queryParams: { status?: string } = useQueryParams()
  const status: number = Number(queryParams.status) || purchasesStatus.all

  const { data: purchasesInCartData } = useQuery({
    queryKey: ['purchases', { status }],
    queryFn: () => purchaseApi.readPurchase({ status: status as PurchaseListStatus })
  })

  const purchaseInCart = purchasesInCartData?.data.data

  const purchaseTabList = purchaseTabs.map((tab) => {
    return (
      <Link
        key={tab.name}
        to={{
          pathname: path.historyPurchase,
          search: createSearchParams({
            status: String(tab.status)
          }).toString()
        }}
        className={classNames('flex flex-1 items-center justify-center border-b-2 bg-white py-4 text-center', {
          'border-b-orange text-orange': status === tab.status,
          'border-b-black/10 text-gray-900': status !== tab.status
        })}
      >
        {tab.name}
      </Link>
    )
  })
  return (
    <div>
      <Helmet>
        <title>Đơn mua - Shopee Clone</title>
        <meta name='description' content='Quản lý thông tin đơn hàng Shopee Clone' />
      </Helmet>
      <div className='sticky top-0 flex rounded-t-sm shadow-sm'>{purchaseTabList}</div>
      <div>
        {purchaseInCart?.map((purchase) => (
          <div key={purchase._id} className='mt-4 rounded-sm border-black/10 bg-white p-6 text-gray-800 shadow-sm'>
            <Link
              to={`${path.home}${generateNameId({ name: purchase.product.name, id: purchase.product._id })}`}
              className='flex'
            >
              <div className='flex-shink-0'>
                <img src={purchase.product.image} alt={purchase.product.name} className='h-20 w-20 object-cover' />
              </div>
              <div className='ml-3 flex-grow overflow-hidden'>
                <div className='truncate'>{purchase.product.name}</div>
                <div className='mt-3'>x{purchase.buy_count}</div>
              </div>
              <div className='ml-3 flex-shrink-0'>
                <span className='truncate text-gray-500 line-through'>
                  ₫{formatCurency(purchase.product.price_before_discount)}
                </span>
                <span className='ml-2 truncate text-orange'>₫{formatCurency(purchase.product.price)}</span>
              </div>
            </Link>
            <div className='flex justify-end'>
              <div>
                <span>Tổng giá tiền</span>
                <span className='ml-4 text-xl text-orange'>
                  ₫{formatCurency(purchase.product.price * purchase.buy_count)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
