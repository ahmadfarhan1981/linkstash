'use client'

import { Application } from '@/app/context/application';
import Link from 'next/link'
import styles from './Header.module.css'
import { useContext } from 'react'
export function Header(){
    const ApplicationContext = useContext(Application);
    const {showHeaders} = ApplicationContext

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

                    "
        >
            <span className="flex flex-[100%] flex-row w-100vw" >
                <span className="flex-[65%]"></span>
                <span className={styles['items']}><Link href="/">Home</Link></span>
                <span className={styles['items']}><Link href="/addBookmark">Add</Link></span>
                <span className={styles['items']}><Link href="/bookmarks" prefetch={false}>Links</Link></span>
                <span className={styles['items']}><Link href="/login">Login</Link></span>
                <span className={styles['items']}><Link href="/settings">Settings</Link></span>
            </span>
            
        </div>
    )

}