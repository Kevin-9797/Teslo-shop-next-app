import { ShopLayout } from "@/components/layouts";
import { ProductsList } from "@/components/products";
import { FullScreenLoading } from "@/components/ui";
import { useProducts } from "@/hooks";
import { Box, Typography } from "@mui/material";
import React from "react";

const WomanPage = () => {
  const { products, isLoading } = useProducts("/products?gender=women");
  return (
    <ShopLayout title="Women´s - teslo " pageDescription="Women´s teslo page">
      <Box>
        <Typography variant="h1">Womens</Typography>
        {isLoading ? (
          <FullScreenLoading />
        ) : (
          <ProductsList products={products} />
        )}
      </Box>
    </ShopLayout>
  );
};

export default WomanPage;
