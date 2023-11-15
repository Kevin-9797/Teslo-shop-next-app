import { AuthLayout } from "@/components/layouts";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect } from "react";
import NextLink from "next/link";
import { useForm } from "react-hook-form";
import { validations } from "@/utils";
import { ErrorOutline } from "@mui/icons-material";
import { useState } from "react";
import { useRouter } from "next/router";
import { getSession, signIn, getProviders } from "next-auth/react";
import { GetServerSideProps } from "next";
import { Provider } from "next-auth/providers/index";

type FormData = {
  email: string;
  password: string;
};
const LoginPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();
  const [showError, setShowError] = useState(false);
  const [providers, setProviders] = useState<any>({});

  useEffect(() => {
    getProviders().then((prov) => {
      setProviders(prov);
    });
  }, []);

  const onLoginUser = async ({ email, password }: FormData) => {
    setShowError(false);

    await signIn("credentials", { email, password });
    // const isValidLogin = await loginUser(email, password);
    // if (!isValidLogin) {
    //   setShowError(true);
    //   setTimeout(() => {
    //     setShowError(false);
    //   }, 3000);
    // }
    // const destination = router.query.p?.toString() ||'/'
    // router.replace(destination);
  };
  return (
    <AuthLayout title="Log in">
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(onLoginUser)} noValidate>
            <Box sx={{ width: 350, padding: "10px 20px" }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h1" component={"h1"}>
                    Login
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
                    label="email"
                    variant="filled"
                    fullWidth
                    {...register("email", {
                      required: "Email required",
                      validate: validations.isEmail,
                    })}
                    error={!!errors.email} //transformamos el objeto en un valor booleano
                    helperText={errors.email?.message}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="password"
                    type="password"
                    variant="filled"
                    fullWidth
                    {...register("password", {
                      required: "Password requerid",
                      minLength: { value: 6, message: "Min 6 characters" },
                    })}
                    error={!!errors.password} //transformamos el objeto en un valor booleano
                    helperText={errors.password?.message}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    color="primary"
                    className="circular-btn"
                    size="large"
                    fullWidth
                  >
                    Login
                  </Button>
                </Grid>
                <Grid item xs={12} display={"flex"} justifyContent={"end"}>
                  <NextLink
                    href={
                      router.query.p
                        ? `/auth/register?p=${router.query.p?.toString()}`
                        : "/auth/register"
                    }
                    passHref
                    legacyBehavior
                  >
                    <Link underline="always">You do not have an account?</Link>
                  </NextLink>
                </Grid>
                <Grid
                  item
                  xs={12}
                  display={"flex"}
                  flexDirection={"column"}
                  justifyContent={"end"}
                >
                  <Divider sx={{ width: "100%", mb: 2 }} />
                  {Object.values(providers).map((provider: any) => {
                    if (provider.id === "credentials")
                      return <div key={"credentials"}></div>;
                    return (
                      <Button
                        key={provider.id}
                        variant={"outlined"}
                        fullWidth
                        color="primary"
                        sx={{ mb: 1 }}
                        onClick={() => signIn( provider.id )}
                      >
                        {provider.name}
                      </Button>
                    );
                  })}
                </Grid>
              </Grid>
            </Box>
          </form>
        </CardContent>
      </Card>
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
export default LoginPage;
