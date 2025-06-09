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
  title: "Flatex Portfolio Analyzer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={roboto.variable}>
      <link
        rel="icon"
        href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%221em%22 font-size=%2280%22>📊</text></svg>"
      ></link>
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
