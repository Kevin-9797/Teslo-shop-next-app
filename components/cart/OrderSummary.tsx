import { CartContext } from "@/context";
import { currency } from "@/utils";
import { Grid, Typography } from "@mui/material";
import { FC, useContext } from "react";

interface Props {
  orderValues?: {
    numberOfItems: number;
    subTotal: number;
    total: number;
    tax: number;
  }
}
export const OrderSummary:FC<Props> = ({ orderValues }) => {
  const { numberOfItems,total,subTotal,tax} = useContext(CartContext)
  const summaryValues = orderValues ? orderValues : {  numberOfItems,total,subTotal,tax  }
  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography>No .products</Typography>
      </Grid>
      <Grid item xs={6} display={"flex"} justifyContent={"end"}>
        <Typography>{summaryValues.numberOfItems} { summaryValues.numberOfItems > 1 ? 'products' : 'product'}</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography>Subtotal</Typography>
      </Grid>
      <Grid item xs={6} display={"flex"} justifyContent={"end"}>
        <Typography>{currency.format(summaryValues.subTotal)}</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography>Impuest ({ Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100 }%)</Typography>
      </Grid>
      <Grid item xs={6} display={"flex"} justifyContent={"end"}>
        <Typography>{currency.format(summaryValues.tax)}</Typography>
      </Grid>
      <Grid item xs={6} sx={{ mt: 2 }}>
        <Typography variant="subtitle1">Total:</Typography>
      </Grid>
      <Grid item xs={6} sx={{ mt:2 }} display={"flex"} justifyContent={"end"}>
        <Typography variant="subtitle1">{currency.format(summaryValues.total)}</Typography>
      </Grid>
      
      
    </Grid>
  );
};
