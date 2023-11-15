import { IProduct } from "@/interfaces";
import {
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  Box,
  Typography,
  Link,
  Chip
} from "@mui/material";
import { FC, useState, useMemo } from "react";
import NextLink from 'next/link';

interface Props {
  product: IProduct;
}
export const ProductCard: FC<Props> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const productImage = useMemo(() => {
    return isHovered
      ? `/products/${product.images[1]}`
      : `/products/${product.images[0]}`;
  }, [isHovered, product.images]);
  return (
    <Grid
      item
      xs={6}
      sm={4}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card>
        <CardActionArea>
          {
            (product.inStock === 0) && (

              <Chip color="primary" label='Not Stock' sx={{ position:'absolute',zIndex: 99, top:'10px',left:'10px'}}></Chip>


            )
          }
          <NextLink href={`/product/${ product.slug }`} passHref legacyBehavior prefetch={false}>
            <Link>
              <CardMedia
                className="fadeIn"
                component={"img"}
                image={productImage}
                alt={product.title}
                onLoad={() => setIsImageLoaded(true)}
              />
            </Link>
          </NextLink>
        </CardActionArea>
      </Card>
      <Box sx={{ mt: 1, display: isImageLoaded ? 'block' : 'none' }} className="fadeIn">
        <Typography fontWeight={700}>{product.title}</Typography>
        <Typography fontWeight={500}>{`$${product.price}`}</Typography>
      </Box>
    </Grid>
  );
};
