"use client";
import { useAuthentication } from "@/components";
export function UserNavigationBar() {
  const authenticationContext = useAuthentication();
  return (
    <div className="title userNavigationBar span-width">
      {authenticationContext.AuthenticationState.isLoggedIn
        ? "Logged in"
        : "Not logged in"}
    </div>
  );
}
