import * as React from "react";
import type { AppProps } from "next/app";
import "./globals.css";
import { AuthProvider } from "../contexts/use-auth-context";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
};

export default MyApp;
