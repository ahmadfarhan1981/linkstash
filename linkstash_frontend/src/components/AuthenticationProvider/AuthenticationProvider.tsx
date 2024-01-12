"use client"
import {
  Authentication,
  useAuthentication,
} from "@/app/context/authentication";
import { ReactNode } from "react";
export default function AuthenticationProvider({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  const val = useAuthentication();
  return (
    <Authentication.Provider value={val}>{children}</Authentication.Provider>
  );
}
