import { ShopLayout } from '@/components/layouts'
import { ProductsList } from '@/components/products'
import { FullScreenLoading } from '@/components/ui'
import { useProducts } from '@/hooks'
import React from 'react'

const KidPage = () => {

    const { products, isLoading } = useProducts('/products?gender=kid');
    console.log( products )
  return (
    <ShopLayout title='Kid´s - teslo ' pageDescription='Kid´s teslo page'>

        {
        isLoading ? <FullScreenLoading />
          :  <ProductsList products={products}/>
      }

    </ShopLayout>
  )
}

export default KidPage