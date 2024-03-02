"use client";

import React from "react";
import { useAuthentication } from "@/components";
import { useRouter } from "next/navigation";
export default function Home() {
  const {logout} = useAuthentication()    
  logout()
  const router = useRouter()
  router.push('/login')  
}
