import { useQuery } from '@tanstack/react-query'
import productApi from 'src/apis/product.api'
import AsideFilter from './components/AsideFilter'
import ProductItem from './components/ProductItem'
import SortProductist from './components/SortProductList'
import Pagination from 'src/components/Pagination'
import { ProductListConfig } from 'src/types/product.type'
import categoryApi from 'src/apis/category.api'
import useQueryConfig from 'src/hooks/useQueryConfig'

export type QueryConfig = {
  [key in keyof ProductListConfig]: string
}

export default function ProductList() {
  const queryConfig = useQueryConfig()

  const { data: productData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig as ProductListConfig)
    },
    keepPreviousData: true,
    staleTime: 3 * 60 * 1000
  })

  const { data: categoryData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return categoryApi.getCategories()
    }
  })

  return (
    <div>
      <div className='bg-gray-200 py-6'>
        <div className='container'>
          {productData && (
            <div className='grid grid-cols-12 gap-6'>
              <div className='col-span-3'>
                <AsideFilter categories={categoryData?.data.data || []} queryConfig={queryConfig} />
              </div>
              <div className='col-span-9'>
                <SortProductist queryConfig={queryConfig} pageSize={productData.data.data.pagination.page_size} />
                <div className='mt-6 grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                  {productData.data.data.products.map((product) => (
                    <div className='col-span-1' key={product._id}>
                      <ProductItem product={product} />
                    </div>
                  ))}
                </div>
                <Pagination queryConfig={queryConfig} pageSize={productData.data.data.pagination.page_size} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
