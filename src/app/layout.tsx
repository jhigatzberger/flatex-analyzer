import "./globals.css";
import { Roboto } from "next/font/google";
import { Metadata } from "next";
import ClientWrapper from "@/components/client-wrapper";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { logtoConfig } from "@/features/auth/logto-config";
import { getLogtoContext, signIn, signOut } from "@logto/next/server-actions";
import SignIn from "@/features/auth/components/sign-in";
import SignOut from "@/features/auth/components/sign-out";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Flatex Analyzer",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated, claims } = await getLogtoContext(logtoConfig);
  return (
    <html lang="en" className={roboto.variable}>
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <body>
        <div className="min-h-svh flex flex-col justify-between">
          <ClientWrapper>
            <Header
              onSignOut={async () => {
                "use server";

                await signOut(logtoConfig);
              }}
              onSignIn={async () => {
                "use server";

                await signIn(logtoConfig);
              }}
              username={claims.username}
              isAuthenticated={isAuthenticated}
            />
            {children}
            <Footer />
          </ClientWrapper>
        </div>
      </body>
    </html>
  );
}
