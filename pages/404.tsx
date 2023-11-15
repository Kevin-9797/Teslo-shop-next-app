import { ShopLayout } from '@/components/layouts'
import React from 'react'
import { Box, Typography } from '@mui/material';

 const Custom404 = () => {
  return (
    <ShopLayout title='Page Not Found' pageDescription='Not showing page'>

        <Box sx={{ flexDirection: { xs: 'column', sm: 'row'} }} display={'flex'}  justifyContent={'center'} alignItems={'center'} height={'calc(100vh - 200px)'}>
            <Typography variant='h1'  component={'h1'} fontSize={80} fontWeight={200}>404 |</Typography>
            <Typography marginLeft={2}>Not search page :(</Typography>
        </Box>

    </ShopLayout>
  )
}

export default Custom404
