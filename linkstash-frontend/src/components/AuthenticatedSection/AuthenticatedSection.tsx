"use client";

import React, { ReactNode } from "react";

import { LoginForm } from "@/components";
import { useAuthentication } from "@/hooks";


// Props definition with an optional `text` prop
type AuthenticatedSectionProps = {
  children: ReactNode ;
  loginPrefixComponent?: JSX.Element;
};

export function AuthenticatedSection({
                                       children,
                                       loginPrefixComponent,
                                       ...divProps
                                     }: (AuthenticatedSectionProps &  React.HTMLProps<HTMLDivElement>)   ): JSX.Element {
  const { AuthenticationState } = useAuthentication();
  const {isLoggedIn } = AuthenticationState;
  //TODO this really should be a composite component
  return (
      <div {...divProps}>
        {!isLoggedIn ? (<div><div>{loginPrefixComponent}</div><LoginForm /></div>) : children}
      </div>
  );
}
