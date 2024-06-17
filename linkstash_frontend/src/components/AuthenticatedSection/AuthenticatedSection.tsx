"use client"

import {LoginForm} from "@/components";
import { ReactNode } from "react";
import { useAuthentication } from "@/hooks";

export function AuthenticatedSection({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  const {AuthenticationState} = useAuthentication()
    return (              
          <>            
            {!AuthenticationState.isLoggedIn && <LoginForm />}
            {AuthenticationState.isLoggedIn && children}
          </>        
    )
}
