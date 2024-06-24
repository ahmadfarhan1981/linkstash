import { ApiCallOptions, Bookmark } from "@/types";
import React, { useState } from "react";

import { makeApiCall } from "@/scripts";
import { useAuthentication } from "@/hooks";

export type useBookmarksReturnValue = {
  bookmarks: Bookmark[];
  setBookmarks: React.Dispatch<React.SetStateAction<Bookmark[]>>;
  fetchBookmarks: () => void;
  isLoading: boolean;
};

export function useBookmarks(): useBookmarksReturnValue {
  const [bookmarks, setBookmarks] = useState([] as Bookmark[]);
  const { AuthenticationState } = useAuthentication();
  const [isLoading, setIsLoading] = useState(false);
  const fetchBookmarks = () => {
    if (!AuthenticationState.isLoggedIn) return;
    const options: ApiCallOptions = {
      endpoint: "/bookmarks",
      method: "GET",
      headers: {
        Authorization: "Bearer ".concat(AuthenticationState.token),
      },
      successCallback: (response: any) => {
        setBookmarks(response.data.data);
      },
    };
    setIsLoading(true);
    makeApiCall(options);
    setIsLoading(false);
  };

  return {
    bookmarks,
    setBookmarks,
    fetchBookmarks,
    isLoading,
  };
}
