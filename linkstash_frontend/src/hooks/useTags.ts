import { ApiCallOptions, TagListItem } from "@/types";
import React, { useState } from "react";
import { makeApiCall } from "@/scripts";
import { useAuthentication } from "@/hooks";

export type useTagsReturnValue = {
  tags: TagListItem[];
  setTags: React.Dispatch<React.SetStateAction<TagListItem[]>>;
  fetchTags: (_options:fetchTagsOptions) => void;
  // deleteBookmark: (bookmarkId:number, onSuccess:()=>void)=>void
  isLoading: boolean;
};


export type SortDirection = "ASC" | "DESC";
export type SortBy = "numBookmarks" | "name" ;
export type fetchTagsOptions = {
  sortBy : SortBy
  sortDirection : SortDirection ; 
}


function generateRequestParams(options:fetchTagsOptions):Record<string, any> {
  const {sortBy, sortDirection} = options;
  const filterString = `{    
    "order": "${sortBy} ${sortDirection}"  
  }`
  return {"filter":filterString}
}

export function useTags(): useTagsReturnValue {
  const [tags, setTags] = useState<TagListItem[]>([]);
  const { AuthenticationState } = useAuthentication();
  const [isLoading, setIsLoading] = useState(false);
  
  const fetchTags = (fetchOptions:fetchTagsOptions) => {
    if (!AuthenticationState.isLoggedIn) return;    
    const params = generateRequestParams(fetchOptions)    
    const apiOptions: ApiCallOptions = {
      endpoint: "/tags",
      method: "GET",
      headers: {
        Authorization: "Bearer ".concat(AuthenticationState.token),
      },
      successCallback: (response: any) => {        
        setTags((_oldState)=>{
          const newState = response.data
          return newState
        });              
      },
      requestParams:params
    };
    setIsLoading(true);    
    makeApiCall(apiOptions, true);
    setIsLoading(false);
  };

  // const deleteBookmark = (bookmarkId:number, onSuccess?:()=>void) => {
  //   if (!AuthenticationState.isLoggedIn) return;
    
  //   const apiOptions: ApiCallOptions = {
  //     endpoint: `/bookmarks/${bookmarkId}`,
  //     method: "DELETE",
  //     headers: {
  //       Authorization: "Bearer ".concat(AuthenticationState.token),
  //     },
  //     successCallback: onSuccess?onSuccess:EMPTY_FUNCTION
  //   };
  //   // TODO loading states are not really reflected properly, makeApiCall is async so the loading status isn't reflected properly
  //   setIsLoading(true);
  //   makeApiCall(apiOptions, false);
  //   setIsLoading(false);
  // };
  
  return {
    tags,
    setTags,
    fetchTags,
    // deleteBookmark,
    isLoading,    
  };
}
