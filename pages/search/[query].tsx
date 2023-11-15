import { ShopLayout } from "@/components/layouts";
import { Box, Typography } from "@mui/material";
import { GetServerSideProps, NextPage } from "next";
import { ProductsList } from "../../components/products";
import { useProducts } from "@/hooks";
import { IProduct } from "@/interfaces";
import { FullScreenLoading } from "@/components/ui";
import { ParsedUrlQuery } from "querystring";
import { dbProducts } from "@/database";

interface Props {
  products: IProduct[];
  foundProducts: boolean;
  query: string;
}

interface Params extends ParsedUrlQuery {
  query: string;
}

const SearchPage: NextPage<Props> = ({ products, foundProducts, query }) => {
  return (
    <ShopLayout
      title={"TESLO-SHOP - SEARCH"}
      pageDescription="Search best products teslo"
    >
      <div>
        <Typography variant="h1" component="h1">
          Shop
        </Typography>

        {foundProducts ? (
          <Typography variant="h1" component="h1" textTransform={'capitalize'}>
            {" "}
            {"Terms: " + query}
          </Typography>
        ) : (
          <>
          <Box display={'flex'}>
            <Typography variant="h2" component="h2">
              Not search products
            </Typography>
            <Typography variant="h2" sx={{ ml: 2 }} component="h2" color={'secondary'}>
              Not 
            </Typography>
          </Box>
          </>
        )}
        <ProductsList products={products} />
      </div>
    </ShopLayout>
  );
};

export const getServerSideProps: GetServerSideProps<Props, Params> = async ({
  params,
}) => {
  const { query = "" } = params!;

  if (query.length === 0) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }
  let products = await dbProducts.getProductsByTerm(query);
  const foundProducts = products.length > 0;

  if (!foundProducts) {
    products = await dbProducts.getAllProducts();
  }
  return {
    props: {
      products,
      foundProducts,
      query,
    },
  };
};
export default SearchPage;
