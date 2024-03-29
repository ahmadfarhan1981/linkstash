import { ApiCallOptions, makeApiCall } from "@/scripts";
import React, { useState } from "react";
import { Bookmark } from "@/types";
import { useAuthentication } from "@/components";

export type useBookmarksReturnValue = {
  bookmarks: Bookmark[];
  setBookmarks: React.Dispatch<React.SetStateAction<Bookmark[]>>;
  fetchBookmarks: () => void;
};

export function useBookmarks(): useBookmarksReturnValue {
  const [bookmarks, setBookmarks] = useState([] as Bookmark[]);
  const { AuthenticationState } = useAuthentication();
  const fetchBookmarks = () => {
    //TODO use makeApiCall()

    if (!AuthenticationState.isLoggedIn) return;

    const options: ApiCallOptions = {
      endpoint: "/bookmarks",
      method: "GET",
      headers: {
        Authorization: "Bearer ".concat(AuthenticationState.token),
      },
      successCallback: (response: any) => {
        console.log(response.data.data);
        setBookmarks(response.data.data);
      },
    };
    makeApiCall(options);
  };

  return {
    bookmarks,
    setBookmarks,
    fetchBookmarks,
  };
}
