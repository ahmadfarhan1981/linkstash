"use client"
import {LoginForm, useAuthentication} from "@/components";
import { ReactNode } from "react";

export default function AuthenticatedSection({
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
