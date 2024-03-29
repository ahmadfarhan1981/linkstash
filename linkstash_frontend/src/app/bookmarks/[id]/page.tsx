"use client";

import {
  AuthenticatedSection,
  BookmarkCard,
  Loader,
  TagCloud,
  useAuthentication,
} from "@/components";
import React, { useContext, useEffect, useState } from "react";
import axios, { AxiosRequestConfig } from "axios";

import { ApiCallOptions, Bookmark } from "@/types";
import styles from "../styles.module.css";
import { makeApiCall } from "@/scripts";

export default function Home({ params }: { params: { id: number } }) {
  const { AuthenticationState } = useAuthentication();
  const [bookmark, setBookmark] = useState<Bookmark>();
  useEffect(() => {
    {
      if (!AuthenticationState.isLoggedIn) return;
      const url = `http://localhost:3030/bookmarks/${params.id}`;
      const config: AxiosRequestConfig = {
        method: "get",
        url: url,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer ".concat(AuthenticationState.token),
        },
      };

      const success = (response: any) => {
        setBookmark(response.data);
        console.log(response.data);
      };

      const option: ApiCallOptions = {
        endpoint: `/bookmarks/${params.id}`,
        method: "GET",
        headers:{
          Authorization: "Bearer ".concat(AuthenticationState.token),
        },
        successCallback: success,
      };
      makeApiCall(option);
    }
  }, [AuthenticationState.isLoggedIn, AuthenticationState.token, params.id]);

  const [data, setData] = useState("");

  return (
    <AuthenticatedSection>
      <div className={styles["bookmarks-page"]}>
        <div className={styles["bookmark-list"]}> 
        <Loader isLoading={!bookmark} text="Loading bookmarks..." >
          <BookmarkCard bookmarkData={bookmark!} ></BookmarkCard>
        </Loader>
        </div>
        <div className={styles["tag-cloud"]}>
          <TagCloud />
        </div>
      </div>
    </AuthenticatedSection>
  );
}
