"use client";

import { ShowValuesProvider } from "../features/portfolio/hooks/use-show-values";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ShowValuesProvider>{children}</ShowValuesProvider>;
}
