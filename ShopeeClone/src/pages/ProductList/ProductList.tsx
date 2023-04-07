import { useQuery } from '@tanstack/react-query'
import React from 'react'
import productApi from 'src/apis/product.api'
import useQueryParams from 'src/hooks/useQueryParams'
import AsideFilter from './AsideFilter'
import ProductItem from './ProductItem'
import SortProductist from './SortProductList'

export default function ProductList() {
  const queryParams = useQueryParams()
  const { data } = useQuery({
    queryKey: ['products', queryParams],
    queryFn: () => {
      return productApi.getProducts(queryParams)
    }
  })
  console.log(data)
  return (
    <div>
      <div className='bg-gray-200 py-6'>
        <div className='container'>
          <div className='grid grid-cols-12 gap-6'>
            <div className='col-span-3'>
              <AsideFilter />
            </div>
            <div className='col-span-9'>
              <SortProductist />
              <div className='mt-6 grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                {Array(30)
                  .fill(0)
                  .map((_, index) => (
                    <div className='col-span-1' key={index}>
                      <ProductItem />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
