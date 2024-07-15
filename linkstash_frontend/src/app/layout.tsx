import "./globals.css";
import "../global_styles/react-aria_combobox.css"

import {
  Header,
  Loader,
  Providers,
  UserNavigationBar,
} from "@/components";
import { Inter, Open_Sans } from "next/font/google";
import type { Metadata } from "next";
import { Suspense } from "react";

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
    <Providers>
      <html lang="en">
        <body className={openSans.className}>
          <div className="screen">
            <Header />
            <UserNavigationBar />
            <div className="left-spacer"></div>
            <div className="content">
              {/* //TODO fix loader. suspense? */}
              <Suspense>{/** https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout useSearchParams in /bookmarks */}
              <Loader isLoading={false}>{children}</Loader>
              </Suspense>
            </div>
            <div className="right-spacer"></div>
          </div>
        </body>
      </html>
    </Providers>
  );
}
