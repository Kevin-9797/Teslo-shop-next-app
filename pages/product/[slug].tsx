import React, { useState,useContext } from "react";
import {
  GetServerSideProps,
  GetStaticPaths,
  GetStaticProps,
  NextPage,
} from "next";
import { ShopLayout } from "@/components/layouts";
import { Grid, Box, Typography, Button, Chip } from "@mui/material";
import { ProductSlideshow } from "../../components/products/ProductSlideshow";
import { ItemCounter } from "../../components/ui/ItemCounter";
import { SizesSelector } from "../../components/products/SizesSelector";

import { ICartProduct, IProduct, ISize } from "@/interfaces";
import { dbProducts } from "@/database";
import { ParsedUrlQuery } from "querystring";
import { useRouter } from "next/router";
import { CartContext } from "@/context";

interface Props {
  product: IProduct;
}

interface Params extends ParsedUrlQuery {
  slug: string;
}

const ProductPage: NextPage<Props> = ({ product }) => {
  const [selectSize, setSelectSize] = useState<ISize>("XL");
  const { addProductCart } = useContext(CartContext)
  const [selectQuantity, setSelectQuantity] = useState(1);
  const router = useRouter();


  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
    _id: product._id,
    image: product.images[0],
    price: product.price,
    size: undefined,
    slug: product.slug,
    title: product.title,
    gender: product.gender,
    quantity: 1,
  });
  // const router = useRouter() ;
  // const { products:product,isLoading } = useProducts<IProduct>(`/products/${ router.query.slug }`); //NO HACER ESTO YA QUE LA DATA LA TENDREMOS  QUE TRAER PREPROCESADA DEL BACKEND
  // Y COMO EL COMPONENTE LA PRIMERA VEZ QUE CARGA EL USE ROUTER VIENE UNDEFINED NECESITAMOS CARGARLO NADA MAS ENTRAMOS
  const actuallyTail = (tail: ISize) => {
    console.log(tail);
    setSelectSize(tail);
    setTempCartProduct( (currentProduct) =>({
      ...currentProduct,
      size: tail
    }));
  };
  const setActuallyQuantity = (quantity: number) => {
    console.log(quantity);
    setSelectQuantity(quantity);
    setTempCartProduct( (currentProduct) =>({
      ...currentProduct,
      quantity
    }));
  };

  const onAddProduct = ( ) => {
    if( !tempCartProduct.size ) return;
    addProductCart({...tempCartProduct});
    console.log(tempCartProduct);
    router.push('/cart')

  }
  return (
    <ShopLayout title={product.title} pageDescription={product.description}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          <ProductSlideshow images={product.images} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Box display={"flex"} flexDirection={"column"}>
            <Typography variant="h1" component={"h1"}>
              {product.title}
            </Typography>
            <Typography
              variant="subtitle1"
              component={"h2"}
            >{`$${product.price}`}</Typography>
            <Box sx={{ my: 2 }}>
              <Typography variant="subtitle2" component={"h3"}>
                Cantidad
              </Typography>
              <ItemCounter 
                currentValue={ tempCartProduct.quantity }
                updatedQuantity={ setActuallyQuantity }
                maxValue={10} />

              <SizesSelector
                selectedSize={tempCartProduct.size}
                sizes={product.sizes}
                setActuallyTail={actuallyTail}
              />
            </Box>
            {product.inStock > 0 ? (
              <Button onClick={() => onAddProduct()} color="secondary" className="circular-btn">
                {tempCartProduct.size ? "Add cart" : "Select Tail"}
              </Button>
            ) : (
              <Chip label="Not stock" color="error" variant="outlined" />
            )}

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2">Description</Typography>
              <Typography variant="subtitle2" component={"h3"}>
                {product.description}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const slugs = await dbProducts.getAllProductsSlug();
  const paths = slugs.map(({ slug }) => ({
    params: { slug },
  }));
  return {
    paths,
    // fallback: false, //si queremos que solo existan las urls que tenemos generadas aca ponemos en false,
    fallback: "blocking", //como en este caso puede haber mas de 150 pokemons pues ponemos blocking
  };
};

export const getStaticProps: GetStaticProps<Props, Params> = async ({
  params,
}) => {
  const { slug } = params!;
  const product = await dbProducts.getProductBySlug(slug);

  if (!product) {
    return {
      redirect: {
        destination: "/", //
        permanent: false, //aqui le decimos a next que no sera una redireccion permanente ya que puede haber un nuevo pokemon
      },
    };
  }
  return {
    props: {
      product,
    },
    revalidate: 86400, // 60 * 60 * 24 esto hace que valide la pagina cada 24 hs ,aqui usamos el incremental static regenaration
  };
};

export default ProductPage;
