'use client'

import { Application } from '@/app/context/application';
import { AuthenticatedSection } from '../AuthenticatedSection/AuthenticatedSection';
import Link from 'next/link'
import styles from './Header.module.css'
import { useAuthentication } from '@/hooks';
import { useContext } from 'react'
export function Header(){
    const ApplicationContext = useContext(Application);
    const {showHeaders} = ApplicationContext
    const { AuthenticationState } = useAuthentication();
    if(!showHeaders) return (<></>)
    return (        
        <div
            className="span-width w-full
            bg-white
                    border-[1px] 
                    border-accent 
                    text-accent 
                    sticky  
                    top-0
                    z-50                              

                    "
        >
            <span className="flex flex-[100%] flex-row w-100vw" >
                <span className="flex-[65%]"></span>                
                {/* <span className={styles['items']}><Link href="/" prefetch={false}>Home</Link></span> */}
                <span className={styles['items']}><Link href="/bookmarks" prefetch={false}>Links</Link></span>
                <span className={styles['items']}><Link href="/addBookmark">Add</Link></span>        
                <span className={styles['items']}><Link href="/settings">Settings</Link></span>
                {!AuthenticationState.isLoggedIn ? (<span className={styles['items']}><Link href="/login">Login</Link></span>) : (<span className={styles['items']}><Link href="/logout">Logout</Link></span>) }
                
            </span>
            
        </div>
    )

}