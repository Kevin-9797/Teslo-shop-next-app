import { AdminLayout } from "@/components/layouts";
import { IOrder, IUser } from "@/interfaces";
import { ConfirmationNumberOutlined } from "@mui/icons-material";
import { Chip, Grid } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import React from "react";
import useSWR from "swr";

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "Order ID",
    width: 250,
  },
  {
    field: "email",
    headerName: "Email",
    width: 250,
  },
  {
    field: "name",
    headerName: "Name Complete",
    width: 300,
  },
  {
    field: "total",
    headerName: "Mount Total",
    width: 300,
  },
  {
    field: "isPaid",
    headerName: "Paid",
    width: 300,
    renderCell: (params: GridRenderCellParams) => {
        return params.row.isPaid ? (  <Chip color="success" label="Paid" /> ) : ( <Chip color="error" label="Not paid" variant="outlined" /> )
    }
    },
    {
        field: "noProducts",
        headerName: "No.Products",
        align: 'center',
        width: 150,
      },

      {
        field: "check",
        headerName: "View Order",
        width: 300,
        renderCell: (params: GridRenderCellParams) => {
            return (
                <a href={ `/admin/orders/${ params.row.id }`} target="_blank">

                </a>
            )
        }
        },
        {
            field: "createdAt",
            headerName: "Created ",
            align: 'center',
            width: 300,
          },

];

const OrdersPage = () => {

    const { data,error } = useSWR<IOrder[]>('/api/admin/orders');

    if(!data && !error){
        return <></>
    }
    const rows = data!.map(( order ) => ({
        id:order._id,
        email: (order.user as IUser).email,
        name: (order.user as IUser).name,
        total: order.total,
        isPaid: order.isPaid,
        noProducts: order.numberOfItems,
        createdAt: order.ceratedAt

    }))
  return (
    <AdminLayout
      title={"Orders"}
      subtitle="Mantein Orders"
      icon={<ConfirmationNumberOutlined />}
    >
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
    </AdminLayout>
  );
};

export default OrdersPage;
