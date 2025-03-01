/* eslint-disable compat/compat */
"use client";

import React, { ReactNode } from "react";
import Link from "next/link";

import {useQuerySelector, useUpdateQuery} from '@/components/Providers/QueryStateProvider/QueryStateProvider';


//TODO refactor the css classes in this component
export function Pager({
                          maxPages,
                      }: {

    maxPages: number;
}): ReactNode {
  const currentPage = useQuerySelector('page');
  const updateQuery = useUpdateQuery();

    const pages = [];
    for (let i = 1; i <= maxPages; i++) {
        pages.push(
            <Link
                key={`page_${i}`}
                href={{
                    pathname: "/bookmarks",
                    query: { page: i },
                }}
                onClick={(e) => {
                    e.preventDefault();
                    updateQuery("page", i);
                }}
                id={`page_${i}`}
                className={`px-2 py-0.5 mx-1 rounded transition-colors duration-200 text-xs
          ${
                    i === currentPage
                        ? "bg-blue-600 text-white font-bold hover:text-slate-300"
                        : "bg-white text-blue-600 border border-blue-600 hover:bg-blue-100"
                }`}
            >
                {i}
            </Link>
        );
    }

    const moveNext = () => {
        const nextPage = currentPage === maxPages ? currentPage : currentPage + 1;
        updateQuery("page", nextPage);
    };
    const movePrev = () => {
        const prevPage = currentPage === 1 ? currentPage : currentPage - 1;
        updateQuery("page", prevPage);
    };
    const moveFirst = () => {
        updateQuery("page", 1);
    };
    const moveLast = () => {
        updateQuery("page", maxPages);
    };

    return (
        <div className="flex items-center justify-end space-x-1 p-1 text-xs font-mono">
            <Link
                href="#"
                onClick={(e) => {
                    e.preventDefault();
                    moveFirst();
                }}
                className="px-1 py-0.5 rounded border border-blue-600 text-blue-600 hover:bg-blue-100 transition-colors duration-200"
                aria-label="First page"
            >
                {"|<"}
            </Link>
            <Link
                href="#"
                onClick={(e) => {
                    e.preventDefault();
                    movePrev();
                }}
                className="px-1 py-0.5 rounded border border-blue-600 text-blue-600 hover:bg-blue-100 transition-colors duration-200"
                aria-label="Previous page"
            >
                {"<"}
            </Link>
            {pages}
            <Link
                href="#"
                onClick={(e) => {
                    e.preventDefault();
                    moveNext();
                }}
                className="px-1 py-0.5 rounded border border-blue-600 text-blue-600 hover:bg-blue-100 transition-colors duration-200"
                aria-label="Next page"
            >
                {">"}
            </Link>
            <Link
                href="#"
                onClick={(e) => {
                    e.preventDefault();
                    moveLast();
                }}
                className="px-1 py-0.5 rounded border border-blue-600 text-blue-600 hover:bg-blue-100 transition-colors duration-200"
                aria-label="Last page"
            >
                {"->|"}
            </Link>
        </div>
    );
}
