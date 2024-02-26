"use client"

import { ReactNode, Suspense, useContext } from "react";

import { Authentication, useAuthentication } from "@/app/context/authentication";
import { Loader } from "@/components";
import LoginForm from "@/components/LoginForm/LoginForm";

export default function AuthenticatedSection({
  children,
}: {
  children: ReactNode;
}): ReactNode {
    // const AuthenticationContext = useContext(Authentication)
    const {AuthenticationState} = useAuthentication()
    return (
      
        <Loader isLoading={AuthenticationState.isPending}>
          <>            
            {!AuthenticationState.isLoggedIn && <LoginForm />}
            {AuthenticationState.isLoggedIn && children}
          </>
        </Loader>
    )
}
