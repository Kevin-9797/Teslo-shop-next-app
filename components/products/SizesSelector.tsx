import { ISize } from '@/interfaces';
import { Box, Button } from '@mui/material';
import React, { FC } from 'react'

interface Props{
    selectedSize?: ISize;
    setActuallyTail?: ( tail:ISize ) => void;
    sizes: ISize[];
}


export const SizesSelector:FC<Props> = ({selectedSize,sizes,setActuallyTail}) => {
  console.log(sizes)
  const sendSelectSizeParent = ( size:ISize ) => {
    setActuallyTail!(size);
  }
  return (
    <Box>
        {
            sizes.map((size) => (
                <Button key={size} size="small" onClick={ () => sendSelectSizeParent(size)} color={ selectedSize == size ? 'primary' : 'info'}>
                  {size}
                </Button>
            ))
        }
    </Box>
  )
}
