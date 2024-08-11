"use client";

import {
  AuthenticatedSection,
  BookmarkCard,
  BookmarksToolbar,
  Loader,
  Pager,
  TagCloud,
} from "@/components";
import { SortBy, SortDirection, useBookmarks } from "@/hooks/useBookmarks";
import { useEffect, useState } from "react";

import {setUrlParam} from "@/scripts";
import styles from "./styles.module.css";
import { useAuthentication } from "@/hooks";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const [sortBy, setSortBy] = useState<SortBy>("created");
  const [sortDirection, setSortDirection] = useState<SortDirection>("DESC");
  const [currentPage, setCurrentPage] = useState<number>(
    page ? Number.parseInt(page) : 1
  );
  const { AuthenticationState } = useAuthentication();
  const { bookmarks, fetchBookmarks, isLoading, numNonPagedResults, deleteBookmark, archiveBookmark } =
    useBookmarks();
  const [maxPage, setMaxPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [filter, setFilter] = useState<string>("");
  
  useEffect(() => {  
    const pageParam = searchParams.get("page");
    const currentPage = pageParam ? Number.parseInt(pageParam) : 1
    setCurrentPage(currentPage);
    setUrlParam("page", currentPage.toString(), searchParams)
  }, [searchParams.get("page")]);

  useEffect(() => {
    const perPage = searchParams.get("perPage");
    setPageSize(Number.parseInt(perPage?perPage:"10"));
  }, [searchParams.get("perPage")]);
  
  const refetchData = () =>{ 
    fetchBookmarks({
    sortBy: sortBy,
    sortDirection: sortDirection,
    page: currentPage,
    perPage: pageSize,
    filter: filter,
  });}
  useEffect(() => {
    {
      if (!AuthenticationState.isLoggedIn) return;
      refetchData();
    }
  }, [
    AuthenticationState.isLoggedIn,
    AuthenticationState.token,
    currentPage,
    pageSize,
    sortBy,
    sortDirection,
    filter
  ]);

  useEffect(() => {
    {
      if (!AuthenticationState.isLoggedIn) return;
      const lastPage = Math.max( Math.ceil(numNonPagedResults / pageSize), 1 )
      setMaxPage(lastPage);
      if(currentPage>lastPage)
        {
           setCurrentPage(lastPage)
           setUrlParam("page", lastPage.toString(), searchParams)
        }
    }
  }, [
    AuthenticationState.isLoggedIn,
    AuthenticationState.token,
    numNonPagedResults,
    pageSize,
  ]);

  const handleArchive = (id:number)=>{ 
    archiveBookmark(id, refetchData);      
  }
  return (
    <AuthenticatedSection>
      <Loader isLoading={isLoading} text="Loading bookmarks">
        <div className={styles["bookmarks-page"]}>
          <div className={styles["bookmark-list"]}>
            <div className="">
              <BookmarksToolbar
                sortBy={sortBy}
                sortDirection={sortDirection}
                pageSize={pageSize}
                filter={filter}
                setSortBy={setSortBy}
                setSortDirection={setSortDirection}
                setPageSize={setPageSize}
                setFilter={setFilter}
              />
            </div>
            <div>
              <Pager
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                maxPages={maxPage}
              />
            </div>
            <div>
              {bookmarks?.map((bookmark) => (
                <BookmarkCard bookmarkData={bookmark} handleDelete={(id)=>{deleteBookmark(id, refetchData);}} handleArchive={handleArchive} key={bookmark.id} />
              ))}
            </div>
            <div>
              <Pager
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                maxPages={maxPage}
              />
            </div>
          </div>
          <div className={styles["tag-cloud"]}>
            <TagCloud />
          </div>
        </div>
      </Loader>
    

    </AuthenticatedSection>
  );
}
