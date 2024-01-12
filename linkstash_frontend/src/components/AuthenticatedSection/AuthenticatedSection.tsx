"use client"
import { ReactNode, useContext } from "react";

import { Authentication } from "@/app/context/authentication";
import LoginForm from "@/components/LoginForm/LoginForm";

export default function AuthenticatedSection({
  children,
}: {
  children: ReactNode;
}): ReactNode {
    const AuthenticationContext = useContext(Authentication)
    const {AuthenticationState} = AuthenticationContext
    return (
        
        <>
            {!AuthenticationState.isLoggedIn && <LoginForm />}
            {AuthenticationState.isLoggedIn && children}
        </>
    )
}
