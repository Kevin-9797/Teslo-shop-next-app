import { AdminLayout } from "@/components/layouts";
import { IProduct } from "@/interfaces";
import { AddOutlined, CategoryOutlined } from "@mui/icons-material";
import { Box, Button, CardMedia, Grid, Link } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import React from "react";
import useSWR from "swr";
import NextLink from "next/link";

const columns: GridColDef[] = [
  {
    field: "img",
    headerName: "Photo",
    renderCell: (params: GridRenderCellParams) => {
      return (
        <a
          href={` /product/${params.row.slug}`}
          target="_blank"
          rel="noreferrer"
        >
          <CardMedia
            component={"img"}
            className="fadeIn"
            image={`${params.row.img}`}
            alt={params.row.title}
          ></CardMedia>
        </a>
      );
    },
  },
  {
    field: "title",
    headerName: "Title Product",
    renderCell: (params: GridRenderCellParams) => {
      return (
        <NextLink href={`/admin/products/${ params.row.slug }`} passHref legacyBehavior>
          <Link underline="always">{ params.row.title }</Link>
        </NextLink>
      );
    },
  },
  {
    field: "gender",
    headerName: "Gender ",
  },
  {
    field: "type",
    headerName: "Type ",
  },
  {
    field: "inStock",
    headerName: "Inventary ",
  },
  {
    field: "price",
    headerName: "Price ",
    width: 300,
  },
  {
    field: "sizes",
    headerName: "Tails ",
    width: 300,
  },
];

const ProductsPage = () => {
  const { data, error } = useSWR<IProduct[]>("/api/admin/products");

  if (!data && !error) {
    return <></>;
  }
  const rows = data!.map((product) => ({
    id: product._id,
    img: product.images[0],
    title: product.title,
    gender: product.gender,
    type: product.type,
    inStock: product.inStock,
    price: product.price,
    sizes: product.sizes.join(", "),
    slug: product.slug,
  }));
  return (
    <AdminLayout
      title={`Products ( ${data?.length}) `}
      subtitle="Mantein Products"
      icon={<CategoryOutlined />}

    >
      <>
      
      <Box display={'flex'} justifyContent={'end'} sx={{ mb:2 }}>
          <Button startIcon={ <AddOutlined />} href="/admin/products/new">

          </Button>
      </Box>
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
      
      </>
    </AdminLayout>
  );
};

export default ProductsPage;
