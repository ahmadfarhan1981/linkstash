"use client";

import {
  ReactNode,
  useEffect, useRef,
  useState,
} from 'react';
import Cookies from "universal-cookie";

import { ApiCallOptions, AuthenticationState } from "@/types";
import {
  BACKEND_URL_COOKIE_NAME,
  getBackendURL,
  makeApiCall,
  TOKEN_COOKIE_NAME,
  USERID_COOKIE_NAME,
} from "@/scripts";
import { Authentication } from "@/hooks";


export function AuthenticationProvider({
  children,
}: {
  children: ReactNode;
}): ReactNode {  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPending, setIsPending] = useState(true);
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [backendUrl, setBackendUrl] = useState("");
  const AuthenticationState = {
    isLoggedIn,
    isPending,
    token,
    userId,
    backendUrl,
  } as AuthenticationState;

  // Store the post-login callback
  const postLoginSuccessCallbackRef = useRef<(() => void) | null>(null);

  // Method to set post-login callback
  const setPostLoginSuccessCallback = (callback: () => void) => {
    postLoginSuccessCallbackRef.current = callback;
  };

  // Store the post-login callback
  const postLoginFailureCallbackRef = useRef<(() => void) | null>(null);

  // Method to set post-login callback
  const setPostLoginFailureCallback = (callback: () => void) => {
    postLoginFailureCallbackRef.current = callback;
  };


  const login = async (username: string, password: string): Promise<void> => {
    let loginBackendUrl = "";
    const success = async (response: any) => {
      const { token, userId } = response.data;
      setIsLoggedIn(true);
      setToken(token);
      setUserId(userId);
      setBackendUrl(loginBackendUrl);
      const cookies = new Cookies();
      cookies.set(TOKEN_COOKIE_NAME, token);
      cookies.set(USERID_COOKIE_NAME, userId);
      cookies.set(BACKEND_URL_COOKIE_NAME, loginBackendUrl);
      if(postLoginSuccessCallbackRef.current){
        postLoginSuccessCallbackRef.current();
      }
    };
    const failure = (error: any) => {
      // TODO handle error
      setIsLoggedIn(false);
      if(postLoginFailureCallbackRef.current){
        postLoginFailureCallbackRef.current();
      }
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
    try {
      loginBackendUrl = await getBackendURL();
      await makeApiCall(options, loginBackendUrl);
    } catch (error) {
      failure(error);
      finallyFunction();
    }
  };
  const verifyLogin = async () => {
    const cookies = new Cookies();
    if (isLoggedIn) return;
    setIsPending(true);

    if (
      cookies.get(TOKEN_COOKIE_NAME) &&
      cookies.get(USERID_COOKIE_NAME) &&
      cookies.get(BACKEND_URL_COOKIE_NAME)
    ) {
      
      const cookieToken = cookies.get(TOKEN_COOKIE_NAME);
      const cookieUserId = cookies.get(USERID_COOKIE_NAME);
      const cookieBackendUrl = cookies.get(BACKEND_URL_COOKIE_NAME);
      makeApiCall({
        method: "GET",
        endpoint: "/whoAmI",
        headers: {            
          Authorization: "Bearer ".concat(cookieToken),
        },        
        successCallback: () => {
          setIsLoggedIn(true);
          setToken(cookieToken);
          setUserId(cookieUserId)
          setBackendUrl(cookieBackendUrl);
        },          
        finallyCallback: () => {
          setIsPending(false);
        },
      }, cookieBackendUrl);
    }else{
      logout();
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
    setUserId("");
    setBackendUrl("");
    const cookies = new Cookies();
    
    if (cookies.get(TOKEN_COOKIE_NAME)) {
      cookies.remove(TOKEN_COOKIE_NAME);
    }
    if (cookies.get(USERID_COOKIE_NAME)) {
      cookies.remove(USERID_COOKIE_NAME);
    }
    cookies.remove(BACKEND_URL_COOKIE_NAME);
  };

  return (

    <Authentication.Provider value={{AuthenticationState, login, logout, setPostLoginSuccessCallback, setPostLoginFailureCallback}}>{children}</Authentication.Provider>
  );
}
