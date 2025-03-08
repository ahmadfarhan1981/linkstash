'use client'

import Link from 'next/link'

import {AuthenticatedSection} from '@/components'

export default function Home() {
    return (        
        <AuthenticatedSection>
            <div>Logged In. <Link href="logout">Logout</Link> </div>
        </AuthenticatedSection>        
    )
}