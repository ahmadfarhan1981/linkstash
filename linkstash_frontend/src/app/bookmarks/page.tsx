"use client";

import { AuthenticatedSection, BookmarkCard, TagCloud, useAuthentication } from "@/components";
import React, { useEffect, useState } from "react";
import axios, { AxiosRequestConfig } from "axios";

import { Bookmark } from "@/types";
import styles from "./styles.module.css";

export default function Home() {
  const { AuthenticationState } = useAuthentication();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>();
  useEffect(() => {
    {
      //TODO use makeApiCall()
      if (!AuthenticationState.isLoggedIn) return;
      const body = JSON.stringify({});
      const url = "http://localhost:3030/bookmarks/";
      const config: AxiosRequestConfig = {
        method: "get",
        url: url,
        data: body,
        timeout: 3000,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer ".concat(AuthenticationState.token),
        },
      };

      axios(config)
        .then(function (response) {
          setBookmarks(response.data.data);
        })
        .catch(function (error) {
          console.log(error);
        })
        .finally(function () {});
    }
  }, [AuthenticationState.isLoggedIn, AuthenticationState.token]);

  const [data, setData] = useState("");

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
