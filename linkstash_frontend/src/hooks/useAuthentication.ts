import { createContext, useContext } from "react";

import { useAuthenticationReturnValue } from "@/types";

export const Authentication = createContext<useAuthenticationReturnValue>(
    {} as useAuthenticationReturnValue
  );
  
export function useAuthentication(): useAuthenticationReturnValue {
    return useContext(Authentication) 
  }
  