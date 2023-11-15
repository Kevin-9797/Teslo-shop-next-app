import { useEffect, useState } from "react";
import "@/styles/globals.css";
import { lightTheme } from "@/themes";
import type { AppProps } from "next/app";
import { ThemeProvider, CssBaseline } from "@mui/material";
import useSWR, { SWRConfig } from "swr";
import { UIProvider } from "@/context";
import { CartProvider } from "../context";
import { AuthProvider } from "../context/auth/AuthProvider";
import { SessionProvider } from "next-auth/react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { currency } from '@/utils';
export default function App({ Component, pageProps }: AppProps) {
  const [showChild, setShowChild] = useState(false);
  useEffect(() => {
    setShowChild(true);
  }, []);
  if (!showChild) {
    return <></>;
  }
  return (
    <SessionProvider>
      <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '', currency: 'EUR' }} >
        <SWRConfig
          value={{
            refreshInterval: 3000,
            fetcher: (resource, init) =>
              fetch(resource, init).then((res) => res.json()),
          }}
        >
          <AuthProvider>
            <CartProvider>
              <UIProvider>
                <ThemeProvider theme={lightTheme}>
                  <CssBaseline />

                  <Component {...pageProps} />
                </ThemeProvider>
              </UIProvider>
            </CartProvider>
          </AuthProvider>
        </SWRConfig>
      </PayPalScriptProvider>
    </SessionProvider>
  );
}
