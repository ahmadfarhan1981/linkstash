import "./globals.css";
import "../global_styles/react-aria_combobox.css"


import {
    Header,
    Providers,
    UserNavigationBar,
} from "@/components";
import React, {ReactNode, Suspense} from "react";
import type { Metadata } from "next";

import { Open_Sans } from "next/font/google";
import {ToastProvider} from '@/components/Providers/ToastProvider';

const openSans = Open_Sans({
    weight: "variable",
    subsets: ["latin", "latin-ext"],
    style: ["italic", "normal"],
    display: "swap",
});

export const metadata: Metadata = {
  title: "Linkstash",
  description: "Link bookmarking and archiving",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Providers>
      <html lang="en">
        <body className={openSans.className}>
        <Header />
        <div className="border-dashed border-x-2 relative screen">

            <UserNavigationBar />            
            <div className="left-spacer"></div>
            <div className="content w-full">
              <ToastProvider>
              {/* //TODO fix loader. suspense? */}
              <Suspense>{/** https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout useSearchParams in /bookmarks */}
                {children}
              </Suspense>
              </ToastProvider>
            </div>
            <div className="right-spacer"></div>
            
          </div>
        </body>
      </html>
    </Providers>
  );
}
