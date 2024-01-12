'use client'
import Link from 'next/link'
import { useContext } from 'react'
export default function Header(){
    return (
        <div
            className="span-width flex flex-row w-100vw 
                    border-[1px] 
                    border-linkstashPurple 
                    text-linkstashPurple 
                    "
        >
            <span className="flex flex-[100%] flex-row w-100vw" >
                <span className="flex-[70%]"></span>
                <span className="flex-1 "><Link href="/">Home</Link></span>
                <span className="flex-1 "><Link href="/bookmarks">Links</Link></span>
                <span className="flex-1 "><Link href="/login">Login</Link></span>
                <span className="flex-1 "><Link href="/">Settings</Link></span>
            </span>
            
        </div>
    )

}