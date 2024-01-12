"use client";

import axios, { AxiosRequestConfig } from "axios";
import { createContext, useCallback, useMemo, useState } from "react";

import Cookies from "universal-cookie";

type AuthenticationState = {
  isLoggedIn: boolean;
  isPending: boolean;
  token: string;
};

export type useAuthenticationReturnValue = {
  AuthenticationState: AuthenticationState;
  login: (username: string, password: string) => void;
};

export const Authentication = createContext<useAuthenticationReturnValue>(
  {} as useAuthenticationReturnValue
);

export function useAuthentication(): useAuthenticationReturnValue {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [token, setToken] = useState("");
  const AuthenticationState = {
    isLoggedIn,
    isPending,
    token,
  } as AuthenticationState;

  //   const cookies = new Cookies();

  //   if (cookies.get("Authorization")) {
  //   headers.append("Authorization", cookies.get("Authorization"))
  //     const cookieToken = cookies.get("Authorization");
  //     setToken(cookieToken.slice("Bearer ".length));
  //   }

  const login = (username: string, password: string): void => {
    const body = JSON.stringify({
      strategy: "local",
      email: username,
      password: password,
    });
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    const url = "http://localhost:3030/authentication/";
    const config: AxiosRequestConfig = {
      method: "post",
      url: url,
      data: body,
      timeout: 3000,
      headers: {
        "Content-Type": "application/json",
      },
    };

    setIsPending(true);
    axios(config)
      .then(function (response) {
        setIsLoggedIn(true);
        const { accessToken } = response.data;
        setToken(accessToken);
      })
      .catch(function (error) {
        // TODO handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
        setIsPending(false);
      });
  };

  return {
    AuthenticationState,
    login,
  };
}
