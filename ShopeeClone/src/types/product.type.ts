export interface Product {
  message: string
  data: {
    _id: string
    images: string[]
    price: number
    rating: number
    price_before_discount: number
    quantity: number
    sold: number
    view: number
    name: string
    description: string
    category: {
      _id: string
      name: string
    }
    image: string
    createdAt: string
    updatedAt: string
  }
}

export interface ProductList {
  product: Product[]
  paginate: {
    page: number
    limit: number
    page_size: number
  }
}

export interface ProductListConfig {
  page?: number
  limit?: number
  sort_by?: 'create_At' | 'view' | 'sold' | 'price'
  order?: 'asc' | 'desc'
  exclude?: string
  rating_filter?: number
  price_min?: number
  price_max?: number
  name?: string
}
