import { ApiCallOptions, Bookmark, TagListItem } from "@/types";
import { EMPTY_FUNCTION, makeApiCall, whereStringBuilder } from "@/scripts";
import React, { useState } from "react";
import {ListData} from 'react-stately'

import { useAuthentication } from "@/hooks";

export type useBookmarksReturnValue = {
  bookmarks: Bookmark[];
  setBookmarks: React.Dispatch<React.SetStateAction<Bookmark[]>>;
  fetchBookmarks: (options:fetchBookmarksOptions) => void;
  deleteBookmark: (bookmarkId:number, onSuccess:()=>void)=>void
  archiveBookmark: (bookmarkId:number, onSuccess: ()=>void)=>void
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
  allTags: ListData<TagListItem>
  anyTags: ListData<TagListItem>
}


function generateRequestParams(options:fetchBookmarksOptions):Record<string, any> {
  const {sortBy, sortDirection, page, perPage, filter, anyTags, allTags} = options;
  const offset = ( page - 1 ) * perPage;  
  const filterStringFilter =`,${whereStringBuilder(filter, anyTags, allTags)}`

  const filterString = `{
    "skip" :${offset},
    "limit": ${perPage},
    "order": "${sortBy} ${sortDirection}"
    ${filterStringFilter}
  }`
  return {"filter":filterString}
}

export function useBookmarks(): useBookmarksReturnValue {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
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
        setBookmarks((_oldState)=>{
          const newState = response.data.data
          return newState
        });        
        setNumNonPagedResult(response.data.countAll)        
      },
      requestParams:params
    };
    setIsLoading(true);    
    makeApiCall(apiOptions, true);
    setIsLoading(false);
  };

  const deleteBookmark = (bookmarkId:number, onSuccess?:()=>void) => {
    if (!AuthenticationState.isLoggedIn) return;
    
    const apiOptions: ApiCallOptions = {
      endpoint: `/bookmarks/${bookmarkId}`,
      method: "DELETE",
      headers: {
        Authorization: "Bearer ".concat(AuthenticationState.token),
      },
      successCallback: onSuccess?onSuccess:EMPTY_FUNCTION
    };
    // TODO loading states are not really reflected properly, makeApiCall is async so the loading status isn't reflected properly
    setIsLoading(true);
    makeApiCall(apiOptions, false);
    setIsLoading(false);
  };
  
  const archiveBookmark = (bookmarkId:number, onSuccess?:()=>void) => {
    if (!AuthenticationState.isLoggedIn) return;    
    const apiOptions: ApiCallOptions = {
      endpoint: `/bookmarks/${bookmarkId}/archive`,
      method: "POST",
      headers: {
        Authorization: "Bearer ".concat(AuthenticationState.token),
      },
      successCallback: onSuccess?onSuccess:EMPTY_FUNCTION 
    };
    // TODO loading states are not really reflected properly, makeApiCall is async so the loading status isn't reflected properly
    setIsLoading(true);
    makeApiCall(apiOptions, false);
    setIsLoading(false);
    
    
  };

  return {
    bookmarks,
    setBookmarks,
    fetchBookmarks,
    deleteBookmark,
    archiveBookmark,
    isLoading,
    numNonPagedResults
  };
}
