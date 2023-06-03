import { useMutation, useQuery } from '@tanstack/react-query'
import React, { useContext, useEffect, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import purchaseApi from 'src/apis/purchase.api'
import Button from 'src/components/Button'
import QuantityController from 'src/components/QuantityController'
import { path } from 'src/constants/path'
import { purchasesStatus } from 'src/constants/purchase'
import { Purchase } from 'src/types/purchase.type'
import { formatCurency, generateNameId } from 'src/utils/utils'
import { produce } from 'immer'
import { keyBy } from 'lodash'
import { toast } from 'react-toastify'
import { AppContext } from 'src/context/app.context'
import { Helmet } from 'react-helmet-async'

export default function Cart() {
  const { extendedPurchases, setExtendedPurchases } = useContext(AppContext)
  const location = useLocation()
  const purchaseIdBuyNow = (location.state as { purchaseId: string } | null)?.purchaseId

  const { data: purchasesInCartData, refetch } = useQuery({
    queryKey: ['purchases', { status: purchasesStatus.inCart }],
    queryFn: () => purchaseApi.readPurchase({ status: purchasesStatus.inCart })
  })
  const purchasesInCart = purchasesInCartData?.data.data

  const updatePurchasesMutation = useMutation({
    mutationFn: purchaseApi.updatePurchases,
    onSuccess: (data) => {
      toast.success(data.data.message, {
        autoClose: 1000
      })
      refetch()
    }
  })

  const deletePurchasesMutation = useMutation({
    mutationFn: purchaseApi.deletePurchase,
    onSuccess: (data) => {
      toast.success(data.data.message, {
        autoClose: 1000
      })
      refetch()
    }
  })

  const buyPurchasesMutation = useMutation({
    mutationFn: purchaseApi.buyPurchases,
    onSuccess: (data) => {
      toast.success(data.data.message, {
        position: 'top-center',
        autoClose: 1000
      })
      refetch()
    }
  })

  useEffect(() => {
    setExtendedPurchases((prev) => {
      const extendedPurchasesObject = keyBy(prev, '_id')
      return (
        purchasesInCart?.map((purchase) => {
          const isPurchaseBuyNow = purchaseIdBuyNow === purchase._id
          return {
            ...purchase,
            checked: isPurchaseBuyNow || Boolean(extendedPurchasesObject[purchase._id]?.checked),
            disable: false
          }
        }) || []
      )
    })
  }, [purchasesInCart, purchaseIdBuyNow, setExtendedPurchases])

  const isCheckedAll = useMemo(
    () => extendedPurchases.every((purchase) => purchase.checked === true),
    [extendedPurchases]
  )
  const purchasesChecked = useMemo(
    () => extendedPurchases.filter((purchase) => purchase.checked === true),
    [extendedPurchases]
  )
  const purchasesCheckedPrice = useMemo(
    () => purchasesChecked.reduce((result, current) => result + current.price * current.buy_count, 0),
    [purchasesChecked]
  )
  const purchaseCheckedSaving = useMemo(
    () =>
      purchasesChecked.reduce(
        (result, current) => result + (current.price_before_discount - current.price) * current.buy_count,
        0
      ),
    [purchasesChecked]
  )

  const handleChecked = (purchaseIndex: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setExtendedPurchases(
      produce((draft) => {
        draft[purchaseIndex].checked = e.target.checked
      })
    )
  }

  const handleCheckedAll = () => {
    setExtendedPurchases((prev) =>
      prev.map((purchase) => ({
        ...purchase,
        checked: !isCheckedAll
      }))
    )
  }

  const handleTypeQuantity = (purchaseIndex: number) => (value: number) => {
    setExtendedPurchases(
      produce((draft) => {
        draft[purchaseIndex].buy_count = value
      })
    )
  }

  const handleQuantity = (purchaseIndex: number, value: number, enable: boolean) => {
    if (enable) {
      const purchase = extendedPurchases[purchaseIndex]
      setExtendedPurchases(
        produce((draft) => {
          draft[purchaseIndex].disable = false
        })
      )
      updatePurchasesMutation.mutate({ product_id: purchase.product._id, buy_count: value })
    }
  }

  const handleDelete = (purchaseIndex: number) => () => {
    const purchaseDeleteId = extendedPurchases[purchaseIndex]._id
    deletePurchasesMutation.mutate([purchaseDeleteId])
  }

  const handleDeletes = () => {
    const purchaseDeleteIds = purchasesChecked.map((purchase) => purchase._id)
    deletePurchasesMutation.mutate(purchaseDeleteIds)
  }

  const handleBuyPurchase = () => {
    const body = purchasesChecked.map((purchase) => ({
      product_id: purchase.product._id,
      buy_count: purchase.buy_count
    }))
    buyPurchasesMutation.mutate(body)
  }

  useEffect(() => {
    return () => {
      history.replaceState(null, '')
    }
  }, [])

  return (
    <div className='bg-neutral-100 py-16'>
      <Helmet>
        <title>Giỏ hàng - Shopee Clone</title>
        <meta name='description' content='Quản lý thông tin giỏ hàng Shopee Clone' />
      </Helmet>
      <div className='container'>
        {extendedPurchases.length > 0 ? (
          <>
            <div className='overflow-auto'>
              <div className='min-w-[1000px]'>
                <div className='grid grid-cols-12 rounded-sm bg-white px-10 py-5 text-sm capitalize text-gray-500 shadow'>
                  <div className='col-span-6'>
                    <div className='flex items-center'>
                      <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                        <input
                          type='checkbox'
                          className='h-4 w-4 accent-orange'
                          checked={isCheckedAll}
                          onChange={handleCheckedAll}
                        />
                      </div>
                      <div className='flex-grow text-black'>Sản phẩm</div>
                    </div>
                  </div>
                  <div className='col-span-6'>
                    <div className='grid grid-cols-5 text-center'>
                      <div className='col-span-2'>Đơn giá</div>
                      <div className='col-span-1'>Số lượng</div>
                      <div className='col-span-1'>Số tiền</div>
                      <div className='col-span-1'>Thao tác</div>
                    </div>
                  </div>
                </div>
                <div className='my-3 rounded-sm bg-white p-5 shadow'>
                  {extendedPurchases?.map((purchase, index) => (
                    <div
                      key={purchase._id}
                      className='firt:mt-0 mt-5 grid grid-cols-12 items-center rounded-sm border border-gray-500 bg-white px-5 py-9 text-sm capitalize text-gray-500 shadow'
                    >
                      <div className='col-span-6'>
                        <div className='flex'>
                          <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                            <input
                              type='checkbox'
                              className='h-4 w-4 accent-orange'
                              checked={purchase.checked}
                              onChange={handleChecked(index)}
                            />
                          </div>
                          <div className='flex-grow'>
                            <div className='flex'>
                              <Link
                                to={`${path.home}${generateNameId({
                                  name: purchase.product.name,
                                  id: purchase.product._id
                                })}`}
                                className='h-20 w-20 flex-shrink-0'
                              >
                                <img src={purchase.product.image} alt={purchase.product.name} />
                              </Link>
                              <div className='flex-grow px-2 pt-1 pb-2'>
                                <Link
                                  to={`${path.home}${generateNameId({
                                    name: purchase.product.name,
                                    id: purchase.product._id
                                  })}`}
                                  className='text-left line-clamp-2'
                                >
                                  {purchase.product.name}
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='col-span-6'>
                        <div className='grid grid-cols-5 items-center text-center'>
                          <div className='col-span-2'>
                            <div className='flex items-center justify-center'>
                              <span className='text-gray-200 line-through'>
                                ₫{formatCurency(purchase.product.price_before_discount)}
                              </span>
                              <span className='ml-3'>₫{formatCurency(purchase.product.price)}</span>
                            </div>
                          </div>
                          <div className='col-span-1'>
                            <QuantityController
                              max={purchase.product.quantity}
                              value={purchase.buy_count}
                              wrapClassName='flex items-center'
                              onIncrease={(value) => handleQuantity(index, value, value <= purchase.product.quantity)}
                              onDecrease={(value) => handleQuantity(index, value, value >= 1)}
                              onType={handleTypeQuantity(index)}
                              onFocusOut={(value) =>
                                handleQuantity(
                                  index,
                                  value,
                                  value >= 1 &&
                                    value <= purchase.product.quantity &&
                                    value !== (purchasesInCart as Purchase[])[index].buy_count
                                )
                              }
                              disabled={purchase.disable}
                            />
                          </div>
                          <div className='col-span-1'>
                            <span className='text-orange'>
                              ₫{formatCurency(purchase.product.price * purchase.buy_count)}
                            </span>
                          </div>
                          <div className='col-span-1'>
                            <button
                              className='bg-none text-black transition-colors hover:text-orange'
                              onClick={handleDelete(index)}
                            >
                              Xóa
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className='sticky bottom-0 z-10 mt-6 flex flex-col rounded-sm bg-white p-5 shadow sm:flex-row sm:items-center'>
              <div className='flex items-center'>
                <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                  <input
                    type='checkbox'
                    className='h-4 w-4 accent-orange'
                    checked={isCheckedAll}
                    onChange={handleCheckedAll}
                  />
                </div>
                <button className='mx-3 border-none bg-none' onClick={handleCheckedAll}>
                  Chọn tất cả ({extendedPurchases.length})
                </button>
                <button className='mx-3 border-none bg-none' onClick={handleDeletes}>
                  Xóa
                </button>
              </div>
              <div className='mt-6 flex flex-col sm:ml-auto sm:mt-0 sm:flex-row sm:items-center'>
                <div>
                  <div className='flex items-center sm:justify-end'>
                    <div>Tổng thanh toán ({purchasesChecked.length} sản phẩm):</div>
                    <div className='text-2xl text-orange sm:ml-2'>₫{formatCurency(purchasesCheckedPrice)}</div>
                  </div>
                  <div className='flex items-center text-sm sm:justify-end'>
                    <div className='text-gray-500'>Tiết kiệm:</div>
                    <div className='ml-6 text-orange'>₫{formatCurency(purchaseCheckedSaving)}</div>
                  </div>
                </div>
                <Button
                  className='mt-6 flex h-10 w-44 items-center justify-center bg-orange p-2 text-sm uppercase text-white hover:bg-orange/80 sm:mt-0 sm:ml-4'
                  onClick={handleBuyPurchase}
                >
                  Mua hàng
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className='flex flex-col items-center justify-center'>
            <div>
              <img
                src='https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/9bdd8040b334d31946f49e36beaf32db.png'
                alt=''
                className='h-24 w-24'
              />
            </div>
            <div className='mt-5 capitalize'>giỏ hàng của bạn còn trống</div>
            <Link to={path.home} className='mt-5 rounded-sm bg-orange px-4 py-2 capitalize text-white hover:opacity-80'>
              Mua ngay
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
