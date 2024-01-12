"use client"

import { Authentication } from "@/app/context/authentication"
import { useContext } from "react"
export default function UserNavigationBar(){
    const authenticationContext = useContext(Authentication)
    return (
        <div className="title userNavigationBar span-width"> 
        { authenticationContext.AuthenticationState.isLoggedIn?"Logged in": "Not logged in" } 
        {/* { authenticationContext.AuthenticationState.isLoggedIn?" ".concat(authenticationContext.AuthenticationState.token): "" }  */}
        </div>
    )
}