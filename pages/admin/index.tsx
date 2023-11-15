import { AdminLayout } from "@/components/layouts";
import { AccessTimeOutlined, AttachMoneyOutlined, CancelPresentationOutlined, CategoryOutlined, CreditCardOffOutlined, CreditCardOutlined, DashboardOutlined, GroupOutlined, ProductionQuantityLimitsOutlined } from "@mui/icons-material";
import { Grid, Typography } from "@mui/material";

import React,{ useState,useEffect } from "react";
import { SummaryTile } from "../../components/admin/SummaryTile";
import useSWR from "swr";
import { DashboardSummaryResponse } from "@/interfaces";

const DashboardPage = () => {
    const { data, error } = useSWR<DashboardSummaryResponse>('/api/admin/dashboard',{
        refreshInterval: 30 * 1000
    });

    const [refreshIn, setRefreshIn] = useState(30);

    useEffect(() => {
      
        const interval = setInterval(( ) => {
            setRefreshIn( refreshIn => refreshIn > 0 ? refreshIn - 1 : 30)
        },1000)
        return () => {
            clearInterval(interval);
        }
    }, [])
    
    if( ! error && !data) {
        return <></>
    }
    if( error ){
        return <Typography>Error al cargar info</Typography>
    }
    const {
    numberOfOrders,
    numberOfProducts,
    paidOrders,
    numberOfClients,
    notPaidOrders,
    producstWithNoInventory,
    lowInventory,
    } = data!;
  return (
    <AdminLayout
      title="Dashboard"
      subtitle="Estadisticas generales"
      icon={<DashboardOutlined />}
    >
      <Grid container spacing={2}>
        <SummaryTile
          title={numberOfOrders.toString()}
          subtitle="Orders Totals"
          icon={<CreditCardOutlined color="secondary" sx={{ fontSize: 40 }} />}
        />
        <SummaryTile
          title={paidOrders.toString()}
          subtitle="Orders Paids"
          icon={<AttachMoneyOutlined color="success" sx={{ fontSize: 40 }}/>}
        />
        <SummaryTile
          title={notPaidOrders.toString()}
          subtitle="Orders Pending"
          icon={<CreditCardOffOutlined color="error" sx={{ fontSize: 40 }} />}
        />
        <SummaryTile
          title={numberOfClients.toString()}
          subtitle="Clients"
          icon={<GroupOutlined color="primary" sx={{ fontSize: 40 }} />}
        />
        <SummaryTile
          title={numberOfProducts.toString()}
          subtitle="Products"
          icon={<CategoryOutlined color="warning" sx={{ fontSize: 40 }} />}
        />
        <SummaryTile
          title={producstWithNoInventory.toString()}
          subtitle="Not stock"
          icon={<CancelPresentationOutlined color="error" sx={{ fontSize: 40 }} />}
        />
        <SummaryTile
          title={lowInventory.toString()}
          subtitle="Low Inventary"
          icon={<ProductionQuantityLimitsOutlined color="warning" sx={{ fontSize: 40 }} />}
        />
        <SummaryTile
          title={refreshIn.toString()}
          subtitle="Update in:"
          icon={<AccessTimeOutlined color="secondary" sx={{ fontSize: 40 }} />}
        />
      </Grid>
    </AdminLayout>
  );
};

export default DashboardPage;
