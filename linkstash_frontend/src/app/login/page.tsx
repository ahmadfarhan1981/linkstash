'useClient'

import {AuthenticatedSection} from '@/components'
import Link from 'next/link'

export default function Home() {
    return (        
        <AuthenticatedSection>
            <div>Logged In. <Link href="logout">Logout</Link> </div>
        </AuthenticatedSection>        
    )
}