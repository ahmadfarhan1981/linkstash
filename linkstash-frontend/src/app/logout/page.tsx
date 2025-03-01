"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthentication } from "@/hooks";

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
