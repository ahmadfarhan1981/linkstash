/* eslint-disable compat/compat */
"use client";

import React, { ReactNode } from "react";
import { useSearchParams } from "next/navigation";

import Link from "next/link";
import { setUrlParam } from "@/scripts";


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
          onClick={(e) => {
            e.preventDefault();
            setCurrentPage(i);
            setUrlParam("page", i.toString(), searchParams);
          }}
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
    setUrlParam("page", nextPage.toString(), searchParams);
  };
  const movePrev = () => {
    const prevPage = currentPage === 1 ? currentPage : currentPage - 1;
    setCurrentPage(prevPage);
    setUrlParam("page", prevPage.toString(), searchParams);
  };
  const moveFirst = () => {
    setCurrentPage(1);
    setUrlParam("page", "1", searchParams);
  };
  const moveLast = () => {
    setCurrentPage(maxPages);
    setUrlParam("page", maxPages.toString(), searchParams);
  };
  return (
    <div className="border-2 font-mono text-xs content-end text-right">
      <Link
        href="#"
        onClick={(e) => {
          e.preventDefault();
          moveFirst();
        }}
      >
        {"|<-"}
      </Link>{" "}
      <Link
        href="#"
        onClick={(e) => {
          e.preventDefault();
          movePrev();
        }}
      >
        {"<"}
      </Link>{" "}
      {pages}
      <Link
        href="#"
        onClick={(e) => {
          e.preventDefault;
          moveNext();
        }}
      >
        {">"}
      </Link>{" "}
      <Link
        href="#"
        onClick={(e) => {
          e.preventDefault();
          moveLast();
        }}
      >
        {"->|"}
      </Link>{" "}
    </div>
  );
}
