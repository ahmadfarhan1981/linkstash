import "./globals.css";

// import UserNavigationBar  from "@/components/index"
// import Loader  from "@/components/index"
import {
  AuthenticationProvider,
  Header,
  Loader,
  UserNavigationBar,
} from "@/components";
import { Inter, Open_Sans } from "next/font/google";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });
const openSans = Open_Sans({
  weight: "variable",
  subsets: ["latin", "latin-ext"],
  style: ["italic", "normal"],
});
export const metadata: Metadata = {
  title: "Linkstash",
  description: "Link bookmarking and archiving",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthenticationProvider>
      <html lang="en">
        <body className={openSans.className}>
          <div className="screen">
            <Header />
            <UserNavigationBar />
            <div className="left-spacer"></div>
            <div className="content">
              <Loader isLoading={false}>{children}</Loader>
            </div>
            <div className="right-spacer"></div>
          </div>
        </body>
      </html>
    </AuthenticationProvider>
  );
}
