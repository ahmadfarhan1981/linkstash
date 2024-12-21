import {createContext, useState} from "react"
type useApplicationReturnValue ={
    isLoading: boolean
    setIsLoading: Function
    showHeaders: boolean
    setShowHeaders: Function

}
export const Application = createContext<useApplicationReturnValue>(
    {} as useApplicationReturnValue
  );

export function useApplication(): useApplicationReturnValue{
    const [isLoading, setIsLoading] = useState(false)
    const [showHeaders, setShowHeaders] = useState(true)

    return {
        isLoading,
        setIsLoading,
        showHeaders,
        setShowHeaders
    }
}