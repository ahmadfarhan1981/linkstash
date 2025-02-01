"use client";

import { LoginForm } from "@/components";
import { ReactNode } from "react";
import { useAuthentication } from "@/hooks";

// Props definition with an optional `text` prop
type AuthenticatedSectionProps = {
  children: ReactNode;
  prefix?: JSX.Element;
};

export function AuthenticatedSection({
  children,
  prefix,
}: AuthenticatedSectionProps): JSX.Element {
  const { AuthenticationState } = useAuthentication();
  const {isLoggedIn } = AuthenticationState;
  //TODO this really should be a composite component
  return (
    <div>
    {!isLoggedIn ? (<div><div>{prefix}</div><LoginForm /></div>) : children}
  </div>
  );
}
