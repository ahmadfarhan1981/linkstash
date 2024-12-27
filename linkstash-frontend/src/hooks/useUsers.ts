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
  
  //TODO options currently unused. reserved for future 
  const fetchUsers = (fetchOptions:fetchUsersOptions) => {
    if (!AuthenticationState.isLoggedIn) return;    
    //const params = generateRequestParams(fetchOptions)  
    const filterObject ={
      "include": [
        {
          "relation": "userPermissions",
          "scope": {
            "fields": {
              "userId": "false"
            }
          }
        }
      ]
    }
    const params:Record<string,any> = {"filter":filterObject}
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
      requestParams:params
    };
    setIsLoading(true);    
    makeApiCall(apiOptions, true);
    setIsLoading(false);
  };
  
  return {
    users,
    setUsers,
    fetchUsers,    
    isLoading    
  };
}
