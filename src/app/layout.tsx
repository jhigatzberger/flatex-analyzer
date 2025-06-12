import "./globals.css";
import { Roboto } from "next/font/google";
import { Metadata } from "next";
import ClientWrapper from "./components/client-wrapper";
import { Footer } from "./components/footer";
import { Header } from "./components/header";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Flatex Analyzer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={roboto.variable}>
      <link rel="icon" href="/favicon.svg" type="image/svg+xml"/>
      <body>
        <div className="min-h-svh flex flex-col justify-between">
          <ClientWrapper>
            <Header />{children}
            <Footer />
          </ClientWrapper>
        </div>
      </body>
    </html>
  );
}
