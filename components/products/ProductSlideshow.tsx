import React, { FC } from 'react'
import { Slide } from 'react-slideshow-image';
import styles from './ProductSlideshow.module.css'
import { Box } from '@mui/material';
import 'react-slideshow-image/dist/styles.css';
interface Props{
    images: string[]
}
export const ProductSlideshow:FC<Props> = ({ images }) => {
  return (
    
    <Slide easing='ease' duration={7000} indicators>

        {
            images.map((image) => {
                const url = `/products/${image}`;
                return (
                    <div  key={image} className={styles['each-slide']}>
                        <Box sx={{
                            height: {
                                xs: "300px",
                                sm: "400px",
                                md: "500px",
                                lg: "600px",
                                xl: "700px",
                              },
                            backgroundImage: `url(${ url })`,
                            backgroundSize:'cover'
                        }}>

                        </Box>
                    </div>
                )
            })
        }

    </Slide>

  )
}
