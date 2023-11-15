import { ShopLayout } from "@/components/layouts";
import React from "react";
import { Typography, Grid, Box, Chip, Link, Button } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import NextLink from "next/link";
import { GetServerSideProps, NextPage } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { dbOrders } from "@/database";
import { IOrder } from "@/interfaces";

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "ID",
    width: 100,
  },
  {
    field: "fullName",
    headerName: "Name Complete",
    width: 300,
  },
  {
    field: "paid",
    headerName: "Pay",
    description: "Shows information about whether the product is paid or not. ",
    renderCell: (params: GridRenderCellParams) => {
      return params.row.paid ? (
        <Chip color="success" label="Paid" />
      ) : (
        <Chip color="error" label="Not paid" variant="outlined" />
      );
    },
  },
  {
    field: "orderId",
    headerName: "Order ID",
    description: "Links that lead to the specific order",
    renderCell: (params: GridRenderCellParams) => {
      return (
        <NextLink href={`/orders/${params.row.orderId}`} passHref legacyBehavior>
          <Link>
            <Button>Order</Button>
          </Link>
        </NextLink>
      );
    },
  },
];

interface Props {
  orders: IOrder[];
}
const HistoryPage: NextPage<Props> = ({ orders }) => {
  const rows: any[] = 
    orders.map((order, idx) => ({
      id: idx + 1,
      paid: order.isPaid,
      fullName: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
      orderId: order._id
    }));
  return (
    <ShopLayout
      title="History the orders"
      pageDescription="History orders client"
    >
      <Box>
        <Typography variant="h1" component={"h1"}>
          History orders
        </Typography>

        <Grid container>
          <Grid item xs={12} sx={{ height: 650, width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 5 },
                },
              }}
              getRowId={(row) => row.id}
              pageSizeOptions={[5, 10, 25]}
            />
          </Grid>
        </Grid>
      </Box>
    </ShopLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/login?p=/orders/history",
        permanent: false,
      },
    };
  }

  const orders = await dbOrders.getOrdersByUser(session.user.id);

  return {
    props: {
      orders,
    },
  };
};
export default HistoryPage;
