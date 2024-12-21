import { ApiCallOptions, User } from "@/types";
import React, { useState } from "react";

import { makeApiCall } from "@/scripts";
import { useAuthentication } from "@/hooks";

export type useUsersReturnValue = {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  fetchUsers: (options:fetchUsersOptions) => void;
  isLoading: boolean;
};


// export type SortDirection = "ASC" | "DESC";
// export type SortBy = "created" | "url" | "domain" | "title";
export type fetchUsersOptions = {
//   sortBy : SortBy
//   sortDirection : SortDirection ; 
//   page: number;
//   perPage: number;
//   filter: string;
}

export function useUsers(): useUsersReturnValue {
  const [users, setUsers] = useState<User[]>([]);
  const { AuthenticationState } = useAuthentication();
  const [isLoading, setIsLoading] = useState(false);
  

  const fetchUsers = (fetchOptions:fetchUsersOptions) => {
    if (!AuthenticationState.isLoggedIn) return;    
    //const params = generateRequestParams(fetchOptions)    
    const apiOptions: ApiCallOptions = {
      endpoint: "/users",
      method: "GET",
      headers: {
        Authorization: "Bearer ".concat(AuthenticationState.token),
      },
      successCallback: (response: any) => {        
        setUsers((_oldState)=>{
          const newState = response.data
          return newState
        });            
      },
      //requestParams:params
    };
    setIsLoading(true);    
    makeApiCall(apiOptions, true);
    setIsLoading(false);
  };

//   const deleteBookmark = (bookmarkId:number, onSuccess?:()=>void) => {
//     if (!AuthenticationState.isLoggedIn) return;
    
//     const apiOptions: ApiCallOptions = {
//       endpoint: `/bookmarks/${bookmarkId}`,
//       method: "DELETE",
//       headers: {
//         Authorization: "Bearer ".concat(AuthenticationState.token),
//       },
//       successCallback: onSuccess?onSuccess:EMPTY_FUNCTION
//     };
//     // TODO loading states are not really reflected properly, makeApiCall is async so the loading status isn't reflected properly
//     setIsLoading(true);
//     makeApiCall(apiOptions, false);
//     setIsLoading(false);
//   };
  
//   const archiveBookmark = (bookmarkId:number, onSuccess?:()=>void) => {
//     if (!AuthenticationState.isLoggedIn) return;    
//     const apiOptions: ApiCallOptions = {
//       endpoint: `/bookmarks/${bookmarkId}/archive`,
//       method: "POST",
//       headers: {
//         Authorization: "Bearer ".concat(AuthenticationState.token),
//       },
//       successCallback: onSuccess?onSuccess:EMPTY_FUNCTION 
//     };
//     // TODO loading states are not really reflected properly, makeApiCall is async so the loading status isn't reflected properly
//     setIsLoading(true);
//     makeApiCall(apiOptions, false);
//     setIsLoading(false);
    
    
//   };

  return {
    users: users,
    setUsers: setUsers,
    fetchUsers,    
    isLoading    
  };
}
