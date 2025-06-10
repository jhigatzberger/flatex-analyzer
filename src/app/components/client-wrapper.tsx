"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import theme from "../../theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ShowValuesProvider } from "../hooks/use-show-values";

const queryClient = new QueryClient();
export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouterCacheProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ShowValuesProvider>
            {children}
          </ShowValuesProvider>
        </ThemeProvider>
      </AppRouterCacheProvider>
    </QueryClientProvider>
  );
}
