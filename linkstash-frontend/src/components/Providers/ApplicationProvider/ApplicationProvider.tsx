"use client"
import { ReactNode } from "react";

import {
  Application,
  useApplication
} from "@/app/context/application";
export function ApplicationProvider({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  const val = useApplication();
  return (
    <Application.Provider value={val}>{children}</Application.Provider>
  );
}
