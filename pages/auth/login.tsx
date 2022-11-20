import { signIn, getProviders } from 'next-auth/react'
import Image from 'next/image'
import Layout from '@components/Layout'
import { client_baseUrl } from '@config/index'
import styles from '@styles/auth.module.scss'

type Providers = {
    providers: {
        [key: string]: {
            id: string
            name: string
            type: string
            signinUrl: string
            callbackUrl: string
        }
    }
}

const Login = ({ providers }: Providers) => {
    const SignInWithGoogle = async () => {
        await signIn('google', {
            callbackUrl: client_baseUrl
        })
    }
    const SignInWithCredentials = async () => {
        await signIn('credentials', {
            email: 'guest@example.com',
            callbackUrl: client_baseUrl
        })
    }

    return (
        <Layout>
            <div className={styles.section_auth_page}>
                <div className={styles.list_container}>
                    <p className={styles.navigation}>ログインしてください</p>
                    <div className={styles.providers_list}>
                        {Object.values(providers).map((provider) => {
                            switch (provider.name) {
                                case 'Google':
                                    return (
                                        <div
                                            key={provider.name}
                                            className={styles.provider_core}
                                        >
                                            <button
                                                onClick={() =>
                                                    SignInWithGoogle()
                                                }
                                                className={
                                                    styles.provider_google_button
                                                }
                                            >
                                                <div
                                                    className={
                                                        styles.image_wrapper
                                                    }
                                                >
                                                    <Image
                                                        className={
                                                            styles.google_logo
                                                        }
                                                        src="/images/google.png"
                                                        alt=""
                                                        layout="fill"
                                                    />
                                                </div>
                                                <p>{provider.name}でログイン</p>
                                            </button>
                                        </div>
                                    )

                                case 'Credential':
                                    return (
                                        <div
                                            key={provider.name}
                                            className={styles.provider_core}
                                        >
                                            <button
                                                onClick={() =>
                                                    SignInWithCredentials()
                                                }
                                                className={
                                                    styles.common_provider_button
                                                }
                                            >
                                                <p>ゲストログイン</p>
                                            </button>
                                        </div>
                                    )

                                default:
                                    return <></>
                            }
                        })}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export const getServerSideProps = async () => {
    const providers = await getProviders()

    return {
        props: {
            providers
        }
    }
}

export default Login
