import { ApplicationProvider, AuthenticationProvider } from "@/components";
import React, { ReactNode } from "react";

export function Providers({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  return (
    <>
      <ApplicationProvider>
        <AuthenticationProvider>
            {children}
        </AuthenticationProvider>
      </ApplicationProvider>
    </>
  );
}
