'use client'

import Link from 'next/link'
import {useContext} from 'react'

import {Application} from '@/app/context/application';
import {useAuthentication} from '@/hooks';

import styles from './Header.module.css'



export function Header() {
    const ApplicationContext = useContext(Application);
    const {showHeaders} = ApplicationContext
    const {AuthenticationState} = useAuthentication();
    if (!showHeaders) return (<></>)

    return (
        <div className="span-width
                        w-full
                        bg-white
                        border-accent
                        text-accent
                        sticky
                        top-0
                        z-50"
        >
            <header className="bg-[hsl(214,100%,97%)] shadow-md just">
                <div className="container mx-auto flex justify-between items-center w-full">
                    <div className="w-12 h-12 flex space-x-3 ">
                        <Link className={"flex"} href={"/"} prefetch={false} >
                            <img src={"/img/icon.svg"} alt={"Logo"}/>
                            <div className={"flex items-center font-bold "}>LinkStash</div>
                        </Link>
                    </div>
                    <nav className={""}>
                        <ul className="flex">
                            {/*<li>*/}
                            {/*    <span className={styles['items']}><Link href="/bookmarks" prefetch={false}>Links</Link></span>*/}
                            {/*</li>*/}
                            <li>

                                <span className={styles['items']}><Link href="/addBookmark">Add</Link></span>
                            </li>
                            <li>

                                <span className={styles['items']}><Link href="/settings">Settings</Link></span>
                            </li>
                            <li>
                                {!AuthenticationState.isLoggedIn ? (
                                    <span className={styles['items']}><Link href="/login">Login</Link></span>) : (
                                    <span className={styles['items']}><Link href="/logout">Logout</Link></span>)}
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>
        </div>
    )
}