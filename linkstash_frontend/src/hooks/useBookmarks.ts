import { ApiCallOptions, Bookmark } from "@/types";
import { DEV_MOCK_RESPONSE, EMPTY_FUNCTION, makeApiCall } from "@/scripts";
import React, { useState } from "react";

import { MOCK_BOOKMARKLIST_FULL_NOSORT_NOFILTER } from "@/scripts/dev_mode";
import { useAuthentication } from "@/hooks";

export type useBookmarksReturnValue = {
  bookmarks: Bookmark[];
  setBookmarks: React.Dispatch<React.SetStateAction<Bookmark[]>>;
  fetchBookmarks: (options:fetchBookmarksOptions) => void;
  isLoading: boolean;
  numNonPagedResults: number;
};


export type SortDirection = "ASC" | "DESC";
export type SortBy = "created" | "url" | "domain" | "title";
export type fetchBookmarksOptions = {
  sortBy : SortBy
  sortDirection : SortDirection ; 
  page: number;
  perPage: number;
  filter: string;
}


function generateRequestParams(options:fetchBookmarksOptions):Record<string, any> {
  const {sortBy, sortDirection, page, perPage, filter} = options;
  const offset = ( page - 1 ) * perPage;
  
  const filterStringFilter =`
  
    ,"where": {
        "or": [
                {
                    "title": {
                        "like": "%${filter}%"
                    }
                },
                {
                    "url": {
                        "like": "%${filter}%"
                    }
                },
                {
                    "description": {
                        "like": "%${filter}%"
                    }
                }
              ]
              }`


  const filterString = `{
    "skip" :${offset},
    "limit": ${perPage},
    "order": "${sortBy} ${sortDirection}"
    ${filter?filterStringFilter:""}
  }`
  return {"filter":filterString}
}

export function useBookmarks(): useBookmarksReturnValue {
  const [bookmarks, setBookmarks] = useState([] as Bookmark[]);
  const { AuthenticationState } = useAuthentication();
  const [isLoading, setIsLoading] = useState(false);
  const [numNonPagedResults, setNumNonPagedResult] = useState(0)
  const fetchBookmarks = (fetchOptions:fetchBookmarksOptions) => {
    if (!AuthenticationState.isLoggedIn) return;
    const params = generateRequestParams(fetchOptions)
    const apiOptions: ApiCallOptions = {
      endpoint: "/bookmarks",
      method: "GET",
      headers: {
        Authorization: "Bearer ".concat(AuthenticationState.token),
      },
      successCallback: (response: any) => {
        setBookmarks(response.data.data);
        setNumNonPagedResult(response.data.countAll)
      },
      requestParams:params
    };
    setIsLoading(true);
    makeApiCall(apiOptions, false, true);
    setIsLoading(false);
  };

 
  return {
    bookmarks,
    setBookmarks,
    fetchBookmarks,

    isLoading,
    numNonPagedResults
  };
}
