"use client"
import {
  Application,
  useApplication
} from "@/app/context/application";
import { ReactNode } from "react";
export default function ApplicationProvider({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  const val = useApplication();
  return (
    <Application.Provider value={val}>{children}</Application.Provider>
  );
}
