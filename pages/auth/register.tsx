import { AuthLayout } from "@/components/layouts";
import {
  Box,
  Button,
  Chip,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import NextLink from "next/link";
import { ErrorOutline } from "@mui/icons-material";
import { format } from "../../utils/currency";
import { useForm } from "react-hook-form";
import { tesloApi } from "@/api";
import { isValidEmail } from "@/utils/validations";
import { validations } from "@/utils";
import { useRouter } from "next/router";
import { AuthContext } from "@/context";
import { getSession, signIn } from "next-auth/react";
import { GetServerSideProps } from "next";

type DataForm = {
  name: string;
  email: string;
  password: string;
};
const RegisterPage = () => {
  const router = useRouter();
  const { registerUser } = useContext(AuthContext)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<DataForm>();
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const onRegisterForm = async ({ name, email, password }: DataForm) => {
    setShowError(false);

    const { hasError,message } = await registerUser(name,email,password);
    if( hasError ){
      setShowError(true);
      setErrorMessage(message!);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
      return;
    }
  
    await signIn('credentials', { email,password });
    // const destination = router.query.p?.toString() ||'/'
    // router.replace(destination);
  };
  return (
    <AuthLayout title="Log in">
      <form onSubmit={handleSubmit(onRegisterForm)}>
        <Box sx={{ width: 350, padding: "10px 20px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h1" component={"h1"}>
                Register
              </Typography>
              <Chip
                label="Username/password not recognized"
                icon={<ErrorOutline />}
                color="error"
                className="fadeIn"
                sx={{ display: showError ? "flex" : "none" }}
              ></Chip>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="name"
                variant="filled"
                fullWidth
                { ...register('name',{
                  required: 'Name is required',
                  minLength: { value: 2, message: "Min 2 characters" },

                })}
                error={!!errors.name}
                helperText={ errors.name?.message }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField label="email" variant="filled" fullWidth { ...register('email',{
                required: 'Email is required',
                validate: validations.isEmail
              })} 
              error={!!errors.email}
              helperText={ errors.email?.message }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="password"
                type="password"
                variant="filled"
                fullWidth
                { ...register('password',{
                  required: 'Password is required',
                  minLength: { value: 6, message: "Min 6 characters" },

                })}
                error={!!errors.password}
                helperText={ errors.password?.message }
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                color="primary"
                type='submit'
                className="circular-btn"
                size="large"
                fullWidth
              >
                Register
              </Button>
            </Grid>
            <Grid item xs={12} display={"flex"} justifyContent={"end"}>
              <NextLink href={router.query.p  ? `/auth/login?p=${ router.query.p?.toString()}` : '/auth/login'} passHref legacyBehavior>
                <Link underline="always">You already have an account?</Link>
              </NextLink>
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const session = await getSession({ req });
  const { p = "/" } = query;
  if (session) {
    return {
      redirect: {
        destination: p.toString(),
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};

export default RegisterPage;
