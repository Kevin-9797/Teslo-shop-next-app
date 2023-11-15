import React,{ useState } from "react";
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
  CircularProgress
} from "@mui/material";
import { CartList } from "../../components/cart/CartList";
import { OrderSummary } from "../../components/cart";
import NextLink from "next/link";
import { ShopLayout } from "@/components/layouts";
import {
  CreditCardOffOutlined,
  CreditScoreOutlined,
} from "@mui/icons-material";
import { GetServerSideProps, NextPage } from "next";
import { authOptions } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { dbOrders, dbUsers } from "@/database";
import { IOrder } from "@/interfaces";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { tesloApi } from "@/api";
import { useRouter } from "next/router";

export type OrderResponseBody = {
  id: string;
  status:
    | "COMPLETED"
    | "SAVED"
    | "APPROVED"
    | "VOIDED"
    | "PAYER_ACTION_REQUIRED"
    | "CREATED";
};

interface Props {
  order: IOrder;
}
const OrderPage: NextPage<Props> = ({ order }) => {
  const { shippingAddress } = order;
  const router = useRouter();
  const [isPaying, setIsPaying] = useState(false);
  const onOrderCompleted = async (details: OrderResponseBody) => {
    if (details.status !== "COMPLETED") {
      return alert("Not paid in paypal");
    }
    setIsPaying(true);
    try {
      const { data } = await tesloApi.post(`/orders/pay`, {
        transactionId: details.id,
        orderId: order._id,
      });

      console.log(data);
      router.reload();
    } catch (error) {
      
      setIsPaying(false);
      console.log(error);
    }
  };

  return (
    <ShopLayout title="Summary order 123423412" pageDescription="Summary order">
      <Box>
        <Typography variant="h1" component={"h1"}>
          Order {order._id}
        </Typography>
        {order.isPaid ? (
          <Chip
            sx={{ my: 2 }}
            label="Order paid"
            variant="outlined"
            color="success"
            icon={<CreditScoreOutlined />}
          />
        ) : (
          <Chip
            sx={{ my: 2 }}
            label="Pending buy"
            variant="outlined"
            color="error"
            icon={<CreditCardOffOutlined />}
          />
        )}

        <Grid container className="fadeIn">
          <Grid item xs={12} sm={7}>
            <CartList products={order.orderItems} />
          </Grid>
          <Grid item xs={12} sm={5}>
            <Card className="summary-card">
              <CardContent>
                <Typography variant="h2" component={"h2"}>
                  Summary Order ({order.numberOfItems}{" "}
                  {order.numberOfItems > 1 ? "products" : "product"})
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Box display={"flex"} justifyContent={"space-between"}>
                  <Typography variant="subtitle1">Delivery address </Typography>
                  <NextLink href={"/checkout/address"} passHref legacyBehavior>
                    <Link underline="always">Edit</Link>
                  </NextLink>
                </Box>
                <Typography>
                  {shippingAddress.firstName} {shippingAddress.lastName}{" "}
                </Typography>
                <Typography>
                  {shippingAddress.address}{" "}
                  {shippingAddress.address2
                    ? `, ${shippingAddress.address2}`
                    : ""}
                </Typography>
                <Typography>{shippingAddress.country}</Typography>
                <Typography>
                  {shippingAddress.city}, {shippingAddress.zip}
                </Typography>
                <Typography>{shippingAddress.phone}</Typography>

                <Divider sx={{ my: 1 }} />

                <OrderSummary
                  orderValues={{
                    numberOfItems: order.numberOfItems,
                    subTotal: order.subTotal,
                    total: order.total,
                    tax: order.tax,
                  }}
                />
                <Box sx={{ mt: 3 }} display={"flex"} flexDirection={"column"}>
                  {}
                  <Box
                    display={"flex"}
                    justifyContent={"center"}
                    className="fadeIn"
                    sx={{ display: isPaying ? ' flex' : 'none'}}
                  >
                    <CircularProgress />
                  </Box>
                  <Box sx={{ display: isPaying ? 'none' : 'flex',flex: 1}} flexDirection={'column'}>

                
                  {order.isPaid ? (
                    <Chip
                      sx={{ my: 2 }}
                      label="Order paid"
                      variant="outlined"
                      color="success"
                      icon={<CreditScoreOutlined />}
                    />
                  ) : (
                    <PayPalButtons
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: {
                                value: `${order.total}`,
                              },
                            },
                          ],
                        });
                      }}
                      onApprove={(data, actions) => {
                        return actions.order!.capture().then((details) => {
                          // onOrderCompleted(details);
                          onOrderCompleted(details);
                          console.log({ details });
                          // const name = details.payer.name.given_name;
                          // alert(`Transaction completed by ${name}`);
                        });
                      }}
                    />
                  )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </ShopLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
  res,
}) => {
  const { id = "" } = query;

  const session: any = await getServerSession(req, res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?p=/orders/${id}`,
        permanent: false,
      },
    };
  }
  const order = await dbOrders.getOrderById(id.toString());
  if (!order) {
    return {
      redirect: {
        destination: `/orders/history`,
        permanent: false,
      },
    };
  }
  if (order?.user !== session.user.id) {
    return {
      redirect: {
        destination: `/orders/history`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      order,
    },
  };
};
export default OrderPage;
