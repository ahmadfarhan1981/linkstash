"use client";

import {useEffect, useState} from 'react';
import {useListData} from 'react-stately';

import {BookmarkCard, BookmarksToolbar, BulkToolbar, Loader, Pager, TagCloud} from '@/components';
import {FetchTagsOptions, TagListItem} from '@/types';
import {useQueryState, useUpdateQuery} from '@/components/Providers/QueryStateProvider/QueryStateProvider';
import {useAuthentication, useBookmarks, useTags} from '@/hooks';

import styles from './styles.module.css';

export function BookmarksPage() {
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
  const { isLoggedIn, token } = AuthenticationState;

  const queryState = useQueryState();
  const updateQuery = useUpdateQuery();

  const refetchData = () => {
    fetchBookmarks({
      sortBy: queryState.sortBy,
      sortDirection: queryState.sortDirection,
      page: queryState.page,
      perPage: queryState.perPage,
      filter: queryState.filter,
      anyTags: queryState.anyTags,
      allTags: queryState.allTags,
    });
  };

  useEffect(() => {
    {
      if (!isLoggedIn) return;
      refetchData();
    }
  }, [isLoggedIn, token, queryState.allTags, queryState.anyTags, queryState.page, queryState.perPage, queryState.filter, queryState.sortBy, queryState.sortDirection]);

  const { fetchTags, tags, simpleTags } = useTags();

  const [fetchTagsOption, setFetchTagsOption] = useState<FetchTagsOptions>({
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
    fetchTagsOption.sortDirection
  ]);

  useEffect(() => {
    {
      if (!isLoggedIn ) return;
      if( numNonPagedResults === undefined ) return;
      const lastPage = Math.max(
        Math.ceil(numNonPagedResults / queryState.perPage),
        1,
      );
      setMaxPage(lastPage);
      if (queryState.page > lastPage) {
        updateQuery("page", lastPage);
      }
    }
    // Debug: Check which dependencies changed
  }, [isLoggedIn, token, queryState, numNonPagedResults]);

  const handleArchive = (id: number) => {
    archiveBookmark(id, refetchData);
  };

  const handleDelete = (id: number) => {
    deleteBookmark(id, refetchData);
  };

  return (
    <>
      <Loader isLoading={isLoading} text="Loading bookmarks">
        <div className={styles["bookmarks-page"]}>
          <div className={styles["bookmark-list"]}>
            <div className="">
              <BookmarksToolbar />
            </div>
            <BulkToolbar
              bookmarks={bookmarks}
              refetchData={refetchData}
              tags={tags}
              tags2={simpleTags}
            />
            <div>
              <Pager maxPages={maxPage} />
            </div>
            <div className={" grid grid-cols-1"}>
              {/*<div className={""}>*/}
              {bookmarks?.map((bookmark) => (
                <BookmarkCard
                  key={bookmark.id}
                  bookmarkData={bookmark}
                  handleDelete={handleDelete}
                  handleArchive={handleArchive}
                />
              ))}
              {/*</div>*/}
            </div>
            <div>
              <Pager maxPages={maxPage} />
            </div>
          </div>
          <div className="relative">
            <div className={styles["tag-cloud"] + " sticky top-16"}>
              <TagCloud
                tags={tags}
                simpleTags={simpleTags}
                setFetchTagsOption={setFetchTagsOption}
              />
            </div>
          </div>
        </div>
      </Loader>
    </>
  );
}
