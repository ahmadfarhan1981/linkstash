"use client";
import { useAuthentication } from "@/hooks";
export function UserNavigationBar() {
  const { AuthenticationState } = useAuthentication();
  return (
    <div className="title userNavigationBar span-width">
      {AuthenticationState.isLoggedIn ? "Logged in" : "Not logged in"}
    </div>
  );
}
