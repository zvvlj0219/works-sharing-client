import styles from './header.module.css'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSession, signOut, getSession  } from 'next-auth/react'
import { GetServerSidePropsContext } from 'next'

type HeaderProps = {
    user_image_url?: string
    username?: string
}

const Header = () => {
    const { data: session, status } = useSession()

    console.log(session)
    console.log(status)

    const Router = useRouter()
    const [isAuth, setIsAuht] = useState<boolean>(false)
    const [isShow, setIsShow] = useState<boolean>(false)

    const onClickHandler = () => {
        console.log('call')
        setIsShow(!isShow)
    }

    const pushLoginScreen = () => {
        Router.push('/auth/login')

        // setIsAuht(true)
        setIsShow(false)
    }

    const pushHomeScreen = () => {
        Router.push('/')
    }

    const pushProfileScreen = () => {
        Router.push(`/profile/${session?.user?.name}/user`)
    }

    const logout = () => {
        signOut()
        // setIsAuht(false)
        setIsShow(false)
    }

    useEffect(() => {
        if(session && status === 'authenticated') {
            setIsAuht(true)
            
        } else {
            setIsAuht(false)
        }
    }, [session])

    return (
        <div className={styles.header}>
            <div
                className={styles.header_container}
            >
                <div
                    className={styles.header_logo}
                    onClick={() => pushHomeScreen()}
                >
                    <p>
                        <span>W</span>orks<br />
                    </p>
                    <p>
                        -<span>S</span>haring
                    </p>
                </div>
                <div
                    className={styles.header_user_wrapper}
                >
                    <div className={styles.header_username_wrapper}>
                        {
                            isAuth && session && <p className={styles.header_username_core}>
                                {session.user?.name}
                            </p>
                        }
                    </div>
                    <div
                        className={styles.header_user_image_wrapper}
                    >
                        {
                            isAuth && session ? (
                                <img
                                    src={session?.user?.image!}
                                    alt=''
                                    className={styles.header_user_image_core}
                                />
                            ) : <div className={styles.header_user_image_core} />
                        }
                    </div>
                    <div
                        role='account_triangle'
                        className={styles.header_account_triangle}
                        onClick={() => onClickHandler()}
                    />
                </div>
            </div>
            {
                isShow && (
                    <div
                        className={
                            isAuth
                            ? `${styles.header_auth_control} ${styles.auth}`
                            : `${styles.header_auth_control} ${styles.notauth}`
                        }
                    >
                        {
                            isAuth ? (
                                <ul>
                                    <li onClick={() => pushProfileScreen()}>プロフィール</li>
                                    <li onClick={() => logout()}>ログアウトする</li>
                                </ul>
                            ) : (
                                <ul> 
                                    <li
                                        onClick={() => pushLoginScreen()}
                                    >サインインする</li>
                                </ul>
                            )
                        }
                    </div>
                )
            }
        </div>
    )
}

export default Header
