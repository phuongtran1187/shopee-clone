import { useQuery } from '@tanstack/react-query'
import productApi from 'src/apis/product.api'
import { omitBy, isUndefined } from 'lodash'
import useQueryParams from 'src/hooks/useQueryParams'
import AsideFilter from './AsideFilter'
import ProductItem from './ProductItem'
import SortProductist from './SortProductList'
import Pagination from 'src/components/Pagination'
import { ProductListConfig } from 'src/types/product.type'

export type QueryConfig = {
  [key in keyof ProductListConfig]: string
}

export default function ProductList() {
  const queryParams: QueryConfig = useQueryParams()

  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || '1',
      limit: queryParams.limit || '20',
      sort_by: queryParams.sort_by,
      order: queryParams.order,
      exclude: queryParams.exclude,
      rating_filter: queryParams.rating_filter,
      price_min: queryParams.price_min,
      price_max: queryParams.price_max,
      name: queryParams.name
    },
    isUndefined
  )

  const { data } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig as ProductListConfig)
    },
    keepPreviousData: true
  })
  console.log(data)
  return (
    <div>
      <div className='bg-gray-200 py-6'>
        <div className='container'>
          {data && (
            <div className='grid grid-cols-12 gap-6'>
              <div className='col-span-3'>
                <AsideFilter />
              </div>
              <div className='col-span-9'>
                <SortProductist queryConfig={queryConfig} pageSize={data.data.data.pagination.page_size} />
                <div className='mt-6 grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                  {data.data.data.products.map((product) => (
                    <div className='col-span-1' key={product._id}>
                      <ProductItem product={product} />
                    </div>
                  ))}
                </div>
                <Pagination queryConfig={queryConfig} pageSize={data.data.data.pagination.page_size} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
