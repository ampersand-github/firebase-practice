import * as React from "react";
import type { AppProps } from "next/app";
import "./globals.css";
import { AuthProvider } from "../contexts/auth";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
};

export default MyApp;
