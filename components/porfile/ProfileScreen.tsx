import { useState, useEffect } from 'react'
import styles from './profileScreen.module.css'
import { useRouter } from 'next/router'
import { useSession, signOut, getSession  } from 'next-auth/react'


type ProfileProps = {
    use_image_url: string
    username: string
}

const ProfileScreen = ({ use_image_url, username }: ProfileProps) => {
    const { data: session, status } = useSession()

    const Router = useRouter()
    const [isProfile, setIsProfile] = useState<boolean>(true)

    const toggleTab = (tab: 'user' | 'upload') => {
        setIsProfile(tab === 'user')
        Router.push(`/profile/${session?.user?.name}/${tab}`)
    }

    useEffect(() => {
        const path = Router.pathname.split('/')[3] as 'user' | 'upload'
        setIsProfile(path === 'user')
    }, [Router.pathname])

    return (
        <div className={styles.profileScreen}>
            <div className={styles.profileScreen_user_container}>
                <div className={styles.profileScreen_image_wrapper}>
                    <img
                        src={use_image_url}
                        alt=''
                        className={styles.profileScreen_image_core}
                    />
                </div>
                <div className={styles.profileScreen_username_wrapper}>
                    <h4
                        className={styles.profileScreen_username_core}
                    >
                        {username}
                    </h4>
                </div>
            </div>
            <div className={styles.profileScreen_tabbar_container}>
                <div
                    role='tab_profile'
                    className={isProfile
                        ? `${styles.profileScreen_tabbar_profile} ${styles.active}`
                        : styles.profileScreen_tabbar_profile
                    }
                    onClick={() => toggleTab('user')}
                >
                    プロフィール
                </div>
                <div
                    role='tab_upload'
                    className={isProfile
                        ? styles.profileScreen_tabbar_upload
                        : `${styles.profileScreen_tabbar_upload} ${styles.active}`
                    }
                    onClick={() => toggleTab('upload')}
                >
                    アップロード
                </div>
            </div>
        </div>
    )
}

export default ProfileScreen
