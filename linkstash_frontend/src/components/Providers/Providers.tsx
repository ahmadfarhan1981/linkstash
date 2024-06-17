import React, { ReactNode } from "react";

import { ApplicationProvider } from "./ApplicationProvider/ApplicationProvider";
import { AuthenticationProvider } from "./AuthenticationProvider/AuthenticationProvider";

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
