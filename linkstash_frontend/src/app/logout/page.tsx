"use client";

import { useAuthentication } from "@/hooks";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { logout } = useAuthentication();
  const router = useRouter();
  useEffect(() => {
    logout();
    router.push("/login");
  });

  return (
    <>
      <div>Logging out</div>
    </>
  );
}
