import { useState, useEffect } from 'react'
import styles from './profileScreen.module.scss'
import Image from 'next/image'
import { useRouter } from 'next/router'

type ProfileProps = {
    use_image_url: string
    username: string
    path: 'user' | 'upload'
}

const ProfileScreen = ({ use_image_url, username, path }: ProfileProps) => {
    const Router = useRouter()
    const [isProfile, setIsProfile] = useState<boolean>(true)

    const toggleTab = (tab: 'user' | 'upload') => {
        setIsProfile(tab === 'user')
        Router.push(`/profile/${username}/${tab}`)
    }

    useEffect(() => {
        setIsProfile(path === 'user')
    }, [path])

    return (
        <div className={styles.profileScreen}>
            <div className={styles.profileScreen_user_container}>
                <div className={styles.profileScreen_image_wrapper}>
                    <Image
                        src={use_image_url}
                        alt=""
                        className={styles.profileScreen_image_core}
                        width={100}
                        height={100}
                    />
                </div>
                <div className={styles.profileScreen_username_wrapper}>
                    <h4 className={styles.profileScreen_username_core}>
                        {username}
                    </h4>
                </div>
            </div>
            <div className={styles.profileScreen_tabbar_container}>
                <div
                    role="tab_profile"
                    className={
                        isProfile
                            ? `${styles.profileScreen_tabbar_profile} ${styles.active}`
                            : styles.profileScreen_tabbar_profile
                    }
                    onClick={() => toggleTab('user')}
                >
                    プロフィール
                </div>
                <div
                    role="tab_upload"
                    className={
                        isProfile
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
