"use client";

import { ApiCallOptions, Bookmark } from "@/types";
import {
  AuthenticatedSection,
  BookmarkCard,
  Loader,
  TagCloud,
} from "@/components";
import { useEffect, useState } from "react";

import { makeApiCall } from "@/scripts";
import styles from "../styles.module.css";
import { useAuthentication } from "@/hooks";

export default function Home({ params }: { params: { id: number } }) {
  const { AuthenticationState } = useAuthentication();
  const [bookmark, setBookmark] = useState<Bookmark>();
  useEffect(() => {
    {
      if (!AuthenticationState.isLoggedIn) return;

      const success = (response: any) => {
        setBookmark(response.data);
      };

      const option: ApiCallOptions = {
        endpoint: `/bookmarks/${params.id}`,
        method: "GET",
        headers: {
          Authorization: "Bearer ".concat(AuthenticationState.token),
        },
        successCallback: success,
      };
      makeApiCall(option);
    }
  }, [AuthenticationState.isLoggedIn, AuthenticationState.token, params.id]);

  return (
    <AuthenticatedSection>
      <div className={styles["bookmarks-page"]}>
        <div className={styles["bookmark-list"]}>
          <Loader isLoading={!bookmark} text="Loading bookmarks...">
            <BookmarkCard bookmarkData={bookmark!}></BookmarkCard>
          </Loader>
        </div>
        <div className={styles["tag-cloud"]}>
          <TagCloud />
        </div>
      </div>
    </AuthenticatedSection>
  );
}
