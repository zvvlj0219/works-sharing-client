import styles from './header.module.scss'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import MenuIcon from '@mui/icons-material/Menu'
import { Divider } from '@mui/material'

const Header = () => {
    const { data: session, status } = useSession()
    const Router = useRouter()

    console.log(session)
    console.log(status)

    const [isAuth, setIsAuht] = useState<boolean>(false)
    const [isShow, setIsShow] = useState<boolean>(false)
    const [drawerState, setDrawerState] = useState<boolean>(false)

    const onClickHandler = () => {
        setIsShow(!isShow)
    }

    const pushLoginScreen = () => {
        Router.push('/auth/login')

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

        setIsShow(false)
    }

    const toggleDrawer = (isOpen: boolean) => {
        setDrawerState(isOpen)
    }

    useEffect(() => {
        if (session && status === 'authenticated') {
            setIsAuht(true)
        } else {
            setIsAuht(false)
        }
    }, [session, status])

    return (
        <div className={styles.header}>
            <div className={styles.header_container}>
                <div
                    className={styles.header_logo}
                    onClick={() => pushHomeScreen()}
                >
                    <p>
                        <span>W</span>orks
                        <br />
                    </p>
                    <p>
                        -<span>S</span>haring
                    </p>
                </div>
                {status !== 'loading' ? (
                    <>
                        <div className={styles.header_menuicon}>
                            <MenuIcon
                                sx={{
                                    color: 'dimgray',
                                    fontSize: 30,
                                    display: 'block',
                                    paddingTop: '1px'
                                }}
                                onClick={() => toggleDrawer(true)}
                            />
                            <SwipeableDrawer
                                anchor="right"
                                open={drawerState}
                                onClose={() => toggleDrawer(false)}
                                onOpen={() => toggleDrawer(true)}
                            >
                                <div className={styles.header_drawerList}>
                                    {session && status === 'authenticated' ? (
                                        <>
                                            <div
                                                className={
                                                    styles.header_drawerProfile
                                                }
                                                onClick={() =>
                                                    pushProfileScreen()
                                                }
                                            >
                                                {session?.user?.image ? (
                                                    <div
                                                        className={
                                                            styles.header_user_image_wrapper
                                                        }
                                                    >
                                                        <Image
                                                            src={
                                                                session.user
                                                                    .image
                                                            }
                                                            alt=""
                                                            className={
                                                                styles.header_user_image_core
                                                            }
                                                            width={40}
                                                            height={40}
                                                            role="img"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div
                                                        className={
                                                            styles.header_user_image_core_none
                                                        }
                                                    >
                                                        <AccountCircleIcon
                                                            sx={{
                                                                fontSize: 48.1,
                                                                display:
                                                                    'block',
                                                                position:
                                                                    'absolute',
                                                                top: '-4.1px',
                                                                left: '-4.1px',
                                                                color: 'lightblue'
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                                <p>プロフィール</p>
                                            </div>
                                            <Divider />
                                            <div
                                                className={
                                                    styles.header_drawerLogout
                                                }
                                                onClick={() => logout()}
                                            >
                                                ログアウトする
                                            </div>
                                        </>
                                    ) : (
                                        <div
                                            className={
                                                styles.header_drawerSignIn
                                            }
                                        >
                                            <p
                                                onClick={() =>
                                                    pushLoginScreen()
                                                }
                                            >
                                                サインインする
                                            </p>
                                            <Divider />
                                        </div>
                                    )}
                                </div>
                            </SwipeableDrawer>
                        </div>
                        <div className={styles.header_user_wrapper}>
                            <div className={styles.header_username_wrapper}>
                                {session && (
                                    <p className={styles.header_username_core}>
                                        {session.user?.name}
                                    </p>
                                )}
                            </div>
                            <div className={styles.header_user_image_wrapper}>
                                {session?.user?.image ? (
                                    <Image
                                        src={session.user.image}
                                        alt=""
                                        className={
                                            styles.header_user_image_core
                                        }
                                        width={40}
                                        height={40}
                                        role="img"
                                    />
                                ) : (
                                    <div
                                        className={
                                            styles.header_user_image_core_none
                                        }
                                    >
                                        <AccountCircleIcon
                                            sx={{
                                                fontSize: 48.1,
                                                display: 'block',
                                                position: 'absolute',
                                                top: '-4.1px',
                                                left: '-4.1px',
                                                color: 'lightblue'
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                            <div
                                role="account_triangle"
                                className={styles.header_account_triangle}
                                onClick={() => onClickHandler()}
                            />
                        </div>
                    </>
                ) : (
                    <></>
                )}
            </div>
            {isShow && (
                <div
                    className={
                        isAuth
                            ? `${styles.header_auth_control} ${styles.auth}`
                            : `${styles.header_auth_control} ${styles.notauth}`
                    }
                >
                    {isAuth ? (
                        <ul>
                            <li onClick={() => pushProfileScreen()}>
                                プロフィール
                            </li>
                            <li onClick={() => logout()}>ログアウトする</li>
                        </ul>
                    ) : (
                        <ul>
                            <li onClick={() => pushLoginScreen()}>
                                サインインする
                            </li>
                        </ul>
                    )}
                </div>
            )}
        </div>
    )
}

export default Header
