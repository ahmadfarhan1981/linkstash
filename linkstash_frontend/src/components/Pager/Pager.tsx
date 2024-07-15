/* eslint-disable compat/compat */
"use client";

import React, { ReactNode } from "react";
import router, { useSearchParams } from "next/navigation";

import Link from "next/link";

export function Pager({
  currentPage,
  setCurrentPage,
  maxPages,
}: {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  maxPages: number;
}): ReactNode {
  const searchParams = useSearchParams();
  const pages = [];
  for (let i = 1; i <= maxPages; i++) {
    pages.push(
      <>
        <Link
          href={{
            pathname: "/bookmarks",
            query: {
              page: i,
            },
          }}
          onClick={() => setCurrentPage(i)}
          id={`page_${i}`}
          className={
            i === currentPage
              ? "text-linkstashPurple font-bold "
              : "text-linkstashPurple underline underline-offset-1"
          }
        >
          {i}
        </Link>{" "}
      </>
    );
  }

  const moveNext = () => {
    const nextPage = currentPage === maxPages ? currentPage : currentPage + 1;
    setCurrentPage(nextPage);
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", nextPage.toString());
    window.history.pushState(null, "", `?${params.toString()}`);
  };
  const movePrev = () => {
    const prevPage = currentPage === 1 ? currentPage : currentPage - 1;
    setCurrentPage(prevPage);
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", prevPage.toString());
    window.history.pushState(null, "", `?${params.toString()}`);
  };
  const moveFirst = () => {
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    window.history.pushState(null, "", `?${params.toString()}`);
  };
  const moveLast = () => {
    setCurrentPage(maxPages);
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", maxPages.toString());
    window.history.pushState(null, "", `?${params.toString()}`);
  };
  return (
    <div className="border-2 font-mono text-xs content-end text-right">
      <Link href="#" onClick={() => moveFirst()}>
        {"|<-"}
      </Link>{" "}
      <Link href="#" onClick={() => movePrev()}>
        {"<"}
      </Link>{" "}
      {pages}
      <Link href="#" onClick={() => moveNext()}>
        {">"}
      </Link>{" "}
      <Link href="#" onClick={() => moveLast()}>
        {"->|"}
      </Link>{" "}
    </div>
  );
}
