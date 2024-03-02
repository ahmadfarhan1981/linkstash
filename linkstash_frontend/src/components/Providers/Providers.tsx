import React, { ReactNode } from "react";
import { AuthenticationProvider, ApplicationProvider } from "@/components";


export default function Providers({
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
