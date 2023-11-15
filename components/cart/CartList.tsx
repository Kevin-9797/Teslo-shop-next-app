import { initialData } from "@/database/seed-data";
import {
  Button,
  Grid,
  Link,
  Typography,
  CardActionArea,
  CardMedia,
  Box,
} from "@mui/material";
import NextLink from "next/link";
import { ItemCounter } from "../ui/ItemCounter";
import { FC, useContext, useState } from "react";
import { CartContext } from "@/context";
import { ICartProduct, IOrderItem } from "@/interfaces";


interface Props {
  editable?: boolean;
  products?: IOrderItem[];
}
export const CartList: FC<Props> = ({ editable = false,products }) => {
  const {cart,updateCartQuantity,removeProductCart} = useContext(CartContext);
  const [ quantityState , setQuantityState ] = useState();
  const [ currentValueCart , setCurrentValueCart ] = useState([
    ...cart
  ]);
  const productsShow = products ? products : cart;

  console.log(cart)
  const onNewCartQuantityValue = (product: ICartProduct, newQuantityValue: number) => {
    product.quantity = newQuantityValue;
    updateCartQuantity( product );
}

const handleClickRemove  = ( product: ICartProduct ) => {
  removeProductCart( product );
}

  return (
    <>
      {productsShow.map((product) => (
        <Grid key={ product.slug + product.size} container spacing={2} sx={{ mb: 1 }} >
          <Grid item xs={3}>
            <NextLink href={"/product/slug"} passHref legacyBehavior>
              <Link>
                <CardActionArea>
                  <CardMedia
                    image={`/products/${product.image}`}
                    component={"img"}
                    sx={{ borderRadius: "5px" }}
                  />
                </CardActionArea>
              </Link>
            </NextLink>
          </Grid>
          <Grid item xs={7}>
            <Box display={"flex"} flexDirection={"column"}>
              <Typography variant="body1">{product.title}</Typography>
              <Typography variant="body1">
                Tail <strong>{ product.size }</strong>
              </Typography>
              {editable ? (
                   <ItemCounter 
                   currentValue={ product.quantity }
                   maxValue={ 10 } 
                   updatedQuantity={ ( value ) => onNewCartQuantityValue(product as ICartProduct, value )}
               />
              ) : (
                <Typography variant="h5">{ product.quantity } products</Typography>
              )}
            </Box>
          </Grid>
          <Grid
            item
            xs={2}
            display={"flex"}
            alignItems={"center"}
            flexDirection={"column"}
          >
            <Typography variant="subtitle1">{`$${product.price}`}</Typography>
            {editable && (
              <Button onClick={ () => handleClickRemove( product as ICartProduct )} variant="text" color="secondary">
                Remove
              </Button>
            )}
          </Grid>
        </Grid>
      ))}
    </>
  );
};
