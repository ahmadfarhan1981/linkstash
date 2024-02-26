"use client";

import React, { useContext, useEffect, useState } from "react";
import axios, { AxiosRequestConfig } from "axios";

import AuthenticatedSection from "@/components/AuthenticatedSection/AuthenticatedSection";
import { Authentication } from "../context/authentication";
import { Bookmark } from "@/types";
import BookmarkCard from "@/components/BookmarkCard/BookmarkCard";
import Cookies from "universal-cookie";
import Pager from "@/components/Pager/Pager";
import TagCloud from "@/components/TagCloud/TagCloud";
import styles from "./styles.module.css";

export default function Home({ params }: { params: { id: number } }) {
  const AuthenticationContext = useContext(Authentication);
  const { AuthenticationState } = AuthenticationContext;
  const [bookmarks, setBookmarks] = useState<Bookmark[]>();
  useEffect(() => {
    {
      if (!AuthenticationState.isLoggedIn) return;
      const body = JSON.stringify({});
      const url = `http://localhost:3030/bookmarks/${params.id}`;
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
