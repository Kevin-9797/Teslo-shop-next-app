import { ShopLayout } from "@/components/layouts";
import React, { useContext } from "react";
import {
  Grid,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
} from "@mui/material";
import { GetServerSideProps } from "next";
import { countriesData, jwt } from "@/utils";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import Cookies from 'js-cookie'
import { useState, ChangeEvent,useEffect } from 'react';
import { CartContext } from "@/context";
type FormData = {
  firstName: string;
  lastName: string;
  address: string;
  address2?: string;
  zip: string;
  city: string;
  country: string;
  phone: string;
};
const getAddressFromCookies = (): FormData => {
  return {
      firstName: Cookies.get("firstName") || "",
      lastName: Cookies.get("lastName") || "",
      address: Cookies.get("address") || "",
      address2: Cookies.get("address2") || "",
      zip: Cookies.get("zip") || "",
      city: Cookies.get("city") || "",
      country: Cookies.get("country") || "",
      phone: Cookies.get("phone") || "",
  };
};

const AddressPage = () => {
  const router = useRouter();
  const { updateAddress } = useContext(CartContext);
  const [selectedCountry, setSelectedCountry] = useState("");
 
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: getAddressFromCookies()

  });
  useEffect(() => {
    const addressFromCookies = getAddressFromCookies();
    setSelectedCountry(addressFromCookies.country)
  }, [])
  
  const onAddressSubmit = ( data: FormData  ) => {
    updateAddress( data );
    router.push('/checkout/summary');
  };
  const onChangeCountry = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSelectedCountry(event.target.value);
};
  return (
    <ShopLayout
      title="Direction"
      pageDescription="Confirm direction the destiny"
    >
      <form onSubmit={handleSubmit(onAddressSubmit)}>
        <Box>
          <Typography variant="h1" component={"h1"}>
            Direction
          </Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Name"
                variant="filled"
                fullWidth
                {...register("firstName", {
                  required: "Zone required",
                })}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name"
                variant="filled"
                fullWidth
                {...register("lastName", {
                })}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Address"
                variant="filled"
                fullWidth
                {...register("address", {
                  required: "Zone required",
                })}
                error={!!errors.address}
                helperText={errors.address?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Address 2"
                variant="filled"
                fullWidth
                {...register("address2", {
                })}
                error={!!errors.address2}
                helperText={errors.address2?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Zip"
                variant="filled"
                fullWidth
                {...register("zip", {
                  required: "Zone required",
                })}
                error={!!errors.zip}
                helperText={errors.zip?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <TextField
                  select
                  variant="filled"
                  label="Country"
                  value={selectedCountry}
                  
                  {...register("country", {
                    required: "Zone required",
                  })}
                  onChange={onChangeCountry}
                  error={!!errors.country}
                  helperText={errors.country?.message}
                >
                  {countriesData.countries.map((country) => (
                    <MenuItem key={country.code} value={country.code}>
                      {country.name}
                    </MenuItem>
                  ))}
                </TextField>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="City"
                variant="filled"
                fullWidth
                {...register("city", {
                  required: "Zone required",
                })}
                error={!!errors.city}
                helperText={errors.city?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone"
                variant="filled"
                fullWidth
                {...register("phone", {
                  required: "Zone required",
                })}
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 5 }} display={"flex"} justifyContent={"center"}>
            <Button
              type={"submit"}
              color="secondary"
              className="circular-btn"
              size="large"
            >
              Review order{" "}
            </Button>
          </Box>
        </Box>
      </form>
    </ShopLayout>
  );
};

// export const getServerSideProps:GetServerSideProps = async({ req }) => {

//   const { token = ''} = req.cookies;
//   let userId = '';
//   let isValidToken = false;

//   try {
//       userId = await jwt.isValidToken( token );
//       isValidToken = true;
//   } catch (error) {
//     isValidToken = false;
//   }

//   if( !isValidToken ){
//     return{
//       redirect:{
//         destination: '/auth/login?p=/checkout/address',
//         permanent: false
//       }
//     }
//   }
//   return {
//     props: {

//     }
//   }

// }

export default AddressPage;
