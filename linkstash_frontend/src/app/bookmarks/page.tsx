"use client";

import {
  AuthenticatedSection,
  BookmarkCard,
  TagCloud,
  useAuthentication,
} from "@/components";
import React, { useEffect } from "react";

import styles from "./styles.module.css";
import { useBookmarks } from "@/hooks/useBookmarks";

export default function Home() {
  const { AuthenticationState } = useAuthentication();
  const { bookmarks, fetchBookmarks } = useBookmarks();
  useEffect(() => {
    {
      if (!AuthenticationState.isLoggedIn) return;
      fetchBookmarks();
    }
  }, [
    AuthenticationState.isLoggedIn,
    AuthenticationState.token,
    fetchBookmarks,
  ]);
  return (
    <AuthenticatedSection>
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
    </AuthenticatedSection>
  );
}
