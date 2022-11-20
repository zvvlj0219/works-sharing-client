import Layout from '@components/Layout'
import styles from '@styles/404.module.scss'

const NotFoundPage = () => {
    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.status}>
                    <div>404</div>
                </div>
                <div className={styles.notfound}>NOT FOUND</div>
                <div className={styles.text}>ページが見つかりませんでした</div>
            </div>
        </Layout>
    )
}

export default NotFoundPage
