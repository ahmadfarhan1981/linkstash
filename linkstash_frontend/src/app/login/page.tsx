'useClient'

import AuthenticatedSection from '@/components/AuthenticatedSection/AuthenticatedSection'
import LoginForm from '@/components/LoginForm/LoginForm'

export default function Home() {
    return (
        
        <AuthenticatedSection>
            <div>Logged In</div>
        </AuthenticatedSection>
        
    )
}