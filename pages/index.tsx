import { ShopLayout } from "@/components/layouts";
import { Typography } from '@mui/material';
import { NextPage } from "next";
import { ProductsList } from '../components/products';
import { useProducts } from "@/hooks";
import { IProduct } from "@/interfaces";
import { FullScreenLoading } from "@/components/ui";
import { useSession } from 'next-auth/react'
const HomePage:NextPage = () =>  {

  const { products,isLoading } = useProducts('/products');
  const session = useSession();
  return (
    <ShopLayout
      title={"TESLO-SHOP - HOME"}
      pageDescription="Search best products teslo"
    >
      <div>
        <Typography variant="h1" component="h1">
          Shop
        </Typography>
        <Typography variant="h2" component="h2" sx={{ mb: 1 }}>
          All products
        </Typography>
      {
        isLoading ? <FullScreenLoading />
          :  <ProductsList products={products}/>
      }


      
      </div>
    </ShopLayout>
  );
}
export default HomePage;