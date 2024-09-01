"use client";

import { ApiCallOptions, AuthenticationState } from "@/types";
import {
  ReactNode,
  useEffect,
  useState,
} from "react";
import { getTokenCookieName, makeApiCall } from "@/scripts";

import { Authentication } from "@/hooks";
import Cookies from "universal-cookie";

export function AuthenticationProvider({
  children,
}: {
  children: ReactNode;
}): ReactNode {  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPending, setIsPending] = useState(true);
  const [token, setToken] = useState("");
  const AuthenticationState = {
    isLoggedIn,
    isPending,
    token,
  } as AuthenticationState;

  const login = async (username: string, password: string): Promise<void> => {
    const success = async (response: any) => {
      const { token } = response.data;
      setIsLoggedIn(true);
      setToken(token);
      const cookies = new Cookies();
      cookies.set(await getTokenCookieName(), token);
    };
    const failure = (error: any) => {
      // TODO handle error
      setIsLoggedIn(false);
      console.error(error);
    };
    const finallyFunction = () => {
      // always executed
      setIsPending(false);
    };
    const body = JSON.stringify({
      username: username,
      password: password,
    });
    const options: ApiCallOptions = {
      endpoint: "/users/login/",
      method: "POST",      
      body: body,
      successCallback: success,
      failureCallback: failure,
      finallyCallback: finallyFunction,
    };

    setIsPending(true);
    await makeApiCall(options);
  };
  const verifyLogin = async () => {
    const cookies = new Cookies();
    //TODO figure out server actions and setting via env var
    const cookieTokenName = "linkstash-token";
    if (isLoggedIn) return;

    setIsPending(true);
    if (cookies.get(cookieTokenName)) {
      
      const cookieToken = cookies.get(cookieTokenName);

      makeApiCall({
        method: "GET",
        endpoint: "/whoAmI",
        headers: {            
          Authorization: "Bearer ".concat(cookieToken),
        },        
        successCallback: () => {
          setIsLoggedIn(true);
          setToken(cookieToken);
        },          
        finallyCallback: () => {
          setIsPending(false);
        },
      });
    }else{
      setIsPending(false)
    }
  };
  // TODO remove useEffect. figure something out
  useEffect(() => {
    verifyLogin();
  }, [isLoggedIn]);

  const logout = () => {
    setIsLoggedIn(false);
    setToken("");
    const cookies = new Cookies();
    const cookieTokenName = "linkstash-token";
    if (cookies.get(cookieTokenName)) {
      cookies.remove(cookieTokenName);
    }
  };

  return (

    <Authentication.Provider value={{AuthenticationState, login, logout}}>{children}</Authentication.Provider>
  );
}
