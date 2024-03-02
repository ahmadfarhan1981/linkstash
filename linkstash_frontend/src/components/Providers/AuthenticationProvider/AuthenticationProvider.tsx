"use client";

import { ApiCallOptions, getTokenCookieName, makeApiCall } from "@/scripts";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import Cookies from "universal-cookie";

type AuthenticationState = {
  isLoggedIn: boolean;
  isPending: boolean;
  token: string;
};
export type useAuthenticationReturnValue = {
  AuthenticationState: AuthenticationState;
  login: (username: string, password: string) => void;
  logout: () => void;
};

const Authentication = createContext<useAuthenticationReturnValue>(
  {} as useAuthenticationReturnValue
);

export function useAuthentication(): useAuthenticationReturnValue {
  return useContext(Authentication) 
}

export default function AuthenticationProvider({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  // const val = useContext(Authentication);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPending, setIsPending] = useState(true);
  const [cookieTokenName, setCookieTokenName] = useState("");
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
      console.log(error);
    };
    const finallyFunction = () => {
      // always executed
      setIsPending(false);
    };
    const body = JSON.stringify({
      strategy: "local",
      email: username,
      password: password,
    });
    const options: ApiCallOptions = {
      endpoint: "/users/login/",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        UserAgent: "react",
      },
      body: body,
      successCallback: success,
      failureCallback: failure,
      finallyCallback: finallyFunction,
    };

    setIsPending(true);
    await makeApiCall(options);
  };

  // TODO remove useEffect. figure something out
  useEffect(() => {
    const verifyLogin = async () => {
      const cookies = new Cookies();
      //if( !cookieTokenName) setCookieTokenName(await getTokenCookieName());

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
            "Content-Type": "application/json",
            Authorization: "Bearer ".concat(cookieToken),
          },
          body: {},
          successCallback: (response: any) => {
            setIsLoggedIn(true);
            setToken(cookieToken);
          },
          failureCallback: (error: any) => {},
          finallyCallback: () => {
            setIsPending(false);
          },
        });
      }
      setIsPending(false);
    };
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
