import { ShopLayout } from "@/components/layouts";
import React,{ useContext, useEffect } from "react";
import {
  Box,
  Card,
  Grid,
  Typography,
  CardContent,
  Divider,
  Button,
} from "@mui/material";
import { CartList } from "../../components/cart/CartList";
import { OrderSummary } from '../../components/cart';
import { CartContext } from "@/context";
import { useRouter } from "next/router";

const CartPage = () => {
  const { isLoaded, cart  } = useContext(CartContext);
  const router = useRouter();
  useEffect(() => {

    if( isLoaded  && cart.length === 0){
      router.replace('/cart/empty');
    }
  
  }, [ isLoaded,cart,router]);

  if( !isLoaded || cart.length === 0 ){
    return (<></>)
  }
  

  return (
    <ShopLayout title="Cart - 3" pageDescription="Cart is shopping">
      <Box>
        <Typography variant="h1" component={"h1"}></Typography>

        <Grid container>
          <Grid item xs={12} sm={7}>
            <CartList editable/>
          </Grid>
          <Grid item xs={12} sm={5}>
            <Card>
              <CardContent>
                <Typography variant="h2" component={"h2"}>
                  Order
                </Typography>
                <Divider sx={{ my: 1 }} />
                <OrderSummary />
                <Box sx={{ mt: 3 }}>
                  <Button color="secondary" className="circular-btn" fullWidth href="/checkout/address">
                    Checkout
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </ShopLayout>
  );
};

export default CartPage;
