"use client";

import {
  AuthenticatedSection,
  BookmarkCard,
  Loader,
  TagCloud,
} from "@/components";
import React, { useEffect } from "react";

import styles from "./styles.module.css";
import { useAuthentication } from "@/hooks";
import { useBookmarks } from "@/hooks/useBookmarks";

export default function Home() {
  const { AuthenticationState } = useAuthentication();
  const { bookmarks, fetchBookmarks, isLoading } = useBookmarks();
  useEffect(() => {
    {
      if (!AuthenticationState.isLoggedIn) return;
      fetchBookmarks();
    }
  }, [
    AuthenticationState.isLoggedIn,
    AuthenticationState.token
  ]);
  return (
    <AuthenticatedSection>
      <Loader isLoading={isLoading} text="Loading bookmarks">
      <div className={styles["bookmarks-page"]}>
        <div className={styles["bookmark-list"]}>
          {bookmarks?.map((bookmark) => (
            <BookmarkCard bookmarkData={bookmark} key={bookmark.id} />
          ))}
        </div>
        <div className={styles["tag-cloud"]}>
          <TagCloud />
        </div>
      </div>
      </Loader>
    </AuthenticatedSection>
  );
}
