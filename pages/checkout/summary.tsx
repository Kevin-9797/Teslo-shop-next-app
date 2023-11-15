import { ShopLayout } from "@/components/layouts";
import React, { useContext, useEffect, useState, } from "react";
import {
  Box,
  Card,
  Grid,
  Typography,
  CardContent,
  Divider,
  Button,
  Link,
  Chip,
} from "@mui/material";
import { CartList } from "../../components/cart/CartList";
import { OrderSummary } from "../../components/cart";
import NextLink from "next/link";
import { CartContext } from "@/context";
import { countriesData } from "@/utils";
import Cookies from 'js-cookie';
import { useRouter } from "next/router";

const SummaryPage = () => {
  const router = useRouter();
  const { shippingAddress, numberOfItems,createOrder } = useContext(CartContext);
  const [isPosting, setIsPosting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  console.log(shippingAddress);
  useEffect(() => {
    if( !Cookies.get('firstName') ){
      router.push('/checkout/address');
    }
  }, [ router ])
  
  if (!shippingAddress) {
    return <></>;
  }

  const {
    firstName,
    lastName,
    address,
    address2 = "",
    city,
    country,
    phone,
    zip,
  } = shippingAddress;

  const onCreateOrder  = async() => {
    setIsPosting(true);
    const {hasError,message } = await createOrder();

    if(hasError){
      setIsPosting(true);
      setErrorMessage(message);
      return;
    }
    router.replace(`/orders/${ message }`);
  }
  return (
    <ShopLayout title="Summary order" pageDescription="Summary order">
      <Box>
        <Typography variant="h1" component={"h1"}>
          Summary Order
        </Typography>

        <Grid container>
          <Grid item xs={12} sm={7}>
            <CartList editable={false} />
          </Grid>
          <Grid item xs={12} sm={5}>
            <Card className="summary-card">
              <CardContent>
                <Typography variant="h2">
                  Summary ({numberOfItems}{" "}
                  {numberOfItems === 1 ? "product" : "products"})
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Box display={"flex"} justifyContent={"space-between"}>
                  <Typography variant="subtitle1">Delivery address </Typography>
                  <NextLink href={"/checkout/address"} passHref legacyBehavior>
                    <Link underline="always">Edit</Link>
                  </NextLink>
                </Box>
                <Typography>
                  {firstName} {lastName}
                </Typography>
                <Typography>
                  {address}
                  {address2 ? `, ${address2}` : ''}
                </Typography>
                <Typography>
                  {city}, {zip}
                </Typography>
                <Typography>
                  {countriesData.countries.find((c) => c.code === country)?.name}
                </Typography>
                <Typography>{phone}</Typography>

                <Divider sx={{ my: 1 }} />
                <Box display={"flex"} justifyContent={"end"}>
                  <NextLink href={"/cart"} passHref legacyBehavior>
                    <Link underline="always">Edit</Link>
                  </NextLink>
                </Box>
                <OrderSummary />
                <Box sx={{ mt: 3 }} display={'flex'} flexDirection={'column'}>
                  <Button onClick={ onCreateOrder } color="secondary" className="circular-btn" fullWidth disabled={isPosting}>
                    Confirm Order
                  </Button>
                  <Chip color="error" label={ errorMessage } sx={{ display: errorMessage ? 'flex' : 'none', mt: 2}}></Chip>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </ShopLayout>
  );
};

export default SummaryPage;
