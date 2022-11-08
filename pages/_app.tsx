import { SessionProvider, SessionProviderProps } from 'next-auth/react'
import '../styles/globals.css'
import type { AppProps } from 'next/app'

type AppPageProps = AppProps<{
    session?: SessionProviderProps['session']
}>

const App = ({ Component, pageProps }: AppPageProps) => {
    return (
        <SessionProvider session={pageProps.session}>
            <Component {...pageProps} />
        </SessionProvider>
    )
}

export default App
