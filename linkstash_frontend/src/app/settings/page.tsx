"use client";

import { useEffect, useState } from "react";

import { AuthenticatedSection } from "@/components";
import Link from "next/link";

export default function Home() {
  const [host, setHost] = useState<string>("");
  useEffect(() => {
    const host =
      typeof window !== "undefined" ? window.location.host : "localhost:3000";
    const protocol =
      typeof window !== "undefined" && window.location.protocol
        ? window.location.protocol
        : "http:";
    setHost(`${protocol}//${host}/addBookmark?url=`);
  }, []);

  const bookmarklet = `javascript:(function() {
    const currentUrl = encodeURIComponent(window.location.href);
    const newUrl = '${host}' + currentUrl;
    window.open(newUrl, '_blank');
})();`;

  return (
    <>
      <AuthenticatedSection prefix="Please login to continue">
        <div className="flex flex-col items-start w-full md:px-20 px-2">
          <h2>Settings pages</h2>
        </div>
        <div className="grid place-items-center bg-card-background shadow p-3 mt-3">
          <Link href={"/users"} className="block">
            [Manage users]
          </Link>
          <Link href={"/import"} className="block">
            [Import]
          </Link>
        </div>
        <div className="md:px-20 px-2">
          <h2>Bookmarklet</h2>
          <div className="bg-card-background shadow p-3 mt-3">
            <p>
              To add this bookmarklet, simply drag the link below to your
              bookmarks bar. Make sure the bookmarks bar is visible by pressing{" "}
              <strong>Ctrl + Shift + B</strong> (or{" "}
              <strong>Cmd + Shift + B</strong> on Mac) if needed.
            </p>
            <div className="inline-block border-2 border border-gray-300 p-2 text-left">
              <a href={bookmarklet}>Stash link!</a>
            </div>
          </div>
        </div>
      </AuthenticatedSection>
    </>
  );
}
