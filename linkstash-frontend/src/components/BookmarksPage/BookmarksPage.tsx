"use client";

import {
  BookmarkCard,
  BookmarksToolbar,
  BulkToolbar,
  Loader,
  Pager,
  TagCloud,
} from "@/components";
import { SortBy, SortDirection, useBookmarks } from "@/hooks/useBookmarks";
import { fetchTagsOptions, useTags } from "@/hooks/useTags";
import { useCallback, useEffect, useState } from "react";

import { TagListItem } from "@/types";
import { setUrlParam } from "@/scripts";
import styles from "./styles.module.css";
import { useAuthentication } from "@/hooks";
import { useListData } from "react-stately";
import { useSearchParams } from "next/navigation";

export function BookmarksPage() {
  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const [sortBy, setSortBy] = useState<SortBy>("created");
  const [sortDirection, setSortDirection] = useState<SortDirection>("DESC");
  const [currentPage, setCurrentPage] = useState<number>(
    page ? Number.parseInt(page) : 1
  );
  const { AuthenticationState } = useAuthentication();
  const {
    bookmarks,
    fetchBookmarks,
    isLoading,
    numNonPagedResults,
    deleteBookmark,
    archiveBookmark,
  } = useBookmarks();
  const [maxPage, setMaxPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [filter, setFilter] = useState<string>("");
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedBookmarks, setSelectedBookmarks] = useState<number[]>([]);
  const { isLoggedIn, token } = AuthenticationState;
  const allFilterTags = useListData({
    initialItems: [],
    getKey: (item: TagListItem) => item.name,
  });
  const anyFilterTags = useListData({
    initialItems: [],
    getKey: (item: TagListItem) => item.name,
  });

  useEffect(() => {
    const pageParam = searchParams.get("page");
    const currentPage = pageParam ? Number.parseInt(pageParam) : 1;
    setCurrentPage(currentPage);
    setUrlParam("page", currentPage.toString(), searchParams);
  }, [searchParams.get("page")]);

  useEffect(() => {
    const perPage = searchParams.get("perPage");
    setPageSize(Number.parseInt(perPage ? perPage : "10"));
  }, [searchParams.get("perPage")]);

  const refetchData = () => {
    fetchBookmarks({
      sortBy: sortBy,
      sortDirection: sortDirection,
      page: currentPage,
      perPage: pageSize,
      filter: filter,
      anyTags: anyFilterTags,
      allTags: allFilterTags,
    });
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode((prev) => !prev);
    console.log(JSON.stringify(selectedBookmarks));
    if (isSelectionMode) {
      setSelectedBookmarks([]); // Clear selection when exiting selection mode
    } else {
      console.log(JSON.stringify(selectedBookmarks));
    }
  };

  const toggleSelection = (id: number) => {
    setSelectedBookmarks((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    console.log("useEffect isLoggedIn");
    {
      if (!isLoggedIn) return;
      refetchData();
    }
  }, [
    isLoggedIn,
    token,
    currentPage,
    pageSize,
    sortBy,
    sortDirection,
    filter,
    anyFilterTags.items,
    allFilterTags.items,
  ]);


  const { fetchTags, tags } = useTags();

  const [fetchTagsOption, setFetchTagsOption] = useState<fetchTagsOptions>({
      sortBy: "numBookmarks",
      sortDirection: "DESC",
    });
    
    useEffect(() => {
      {
        if (!isLoggedIn) return;
        fetchTags({
          sortBy: fetchTagsOption.sortBy,
          sortDirection: fetchTagsOption.sortDirection,
        });
      }
    }, [
      isLoggedIn,
      token,
      fetchTagsOption.sortBy,
      fetchTagsOption.sortDirection,
      fetchTagsOption,
      bookmarks,
    ]);
  
  const stableSetUrlParam = useCallback(
    (key:any, value:any) => {
      setUrlParam(key, value, searchParams);
    },
    [searchParams]
  );

  useEffect(() => {
    {
      if (!isLoggedIn) return;
      const lastPage = Math.max(Math.ceil(numNonPagedResults / pageSize), 1);
      setMaxPage(lastPage);
      if (currentPage > lastPage) {
        setCurrentPage(lastPage);
        stableSetUrlParam("page", lastPage.toString());
        // setUrlParam("page", lastPage.toString(), searchParams);
      }
    }
    // Debug: Check which dependencies changed
  }, [isLoggedIn, token, currentPage, numNonPagedResults, pageSize]);

  const handleArchive = (id: number) => {
    archiveBookmark(id, refetchData);
  };

  const handleDelete = (id: number) => {
    deleteBookmark(id, refetchData);
  };

  const handleOnClick = () => {
    alert(JSON.stringify(selectedBookmarks));
  };
  return (
    <>
      
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
            <BulkToolbar bookmarks={bookmarks} refetchData={refetchData}/>
            <div>
              <Pager
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                maxPages={maxPage}
              />
            </div>
            <div>



              <div>
                {bookmarks?.map((bookmark) => (
                  <BookmarkCard
                    key={bookmark.id}
                    contents={
                      <>
                        <BookmarkCard.Title />
                        <BookmarkCard.Descriptions />
                        <BookmarkCard.TagGroup />
                        <BookmarkCard.BottomBar />
                      </>
                    }
                    contextProps={{
                      bookmarkData: bookmark,
                      handleDelete: handleDelete,
                      handleArchive: handleArchive                      
                    }}
                  />
                ))}
              </div>
            </div>
            <div>
              <Pager
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                maxPages={maxPage}
              />
            </div>
          </div>
          <div className="relative">
            <div className={styles["tag-cloud"] + " sticky top-16"}>
              <TagCloud
                allFilterTags={allFilterTags}
                anyFilterTags={anyFilterTags}
                tags={tags}
                fetchTags={fetchTags}
                fetchTagsOption={fetchTagsOption}
                setFetchTagsOption={setFetchTagsOption}
              />
            </div>
          </div>
        </div>
      </Loader>
    </>
  );
}
