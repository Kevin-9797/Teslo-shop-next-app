import { ShopLayout } from '@/components/layouts'
import { ProductsList } from '@/components/products'
import { FullScreenLoading } from '@/components/ui'
import { useProducts } from '@/hooks'
import React from 'react'

const MenPage = () => {

    const { products, isLoading } = useProducts('/products?gender=men');
    console.log( products )
  return (
    <ShopLayout title='Men´s - teslo ' pageDescription='Men´s teslo page'>

        {
        isLoading ? <FullScreenLoading />
          :  <ProductsList products={products}/>
      }

    </ShopLayout>
  )
}

export default MenPage