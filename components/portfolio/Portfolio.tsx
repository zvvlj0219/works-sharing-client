import { ObjectId } from 'mongoose'
import styles from './portfolio.module.scss'
import StarIcon from '@mui/icons-material/Star'
import { useResizeIcon } from '../../helpers/useResizeIcon'
import Image from 'next/image'

type PortfolioProps = {
    _id: ObjectId
    image_preview_url?: string
    username: string
    work_name: string
    review_avg: number
}

const PortfolioContainer = (portfolio: PortfolioProps) => {
    const { resizeSmallIcon } = useResizeIcon()
    return (
        <div className={styles.ptf_container}>
            <div className={styles.ptf_image_wrapper}>
                {portfolio.image_preview_url ? (
                    <Image
                        src={portfolio.image_preview_url}
                        alt="image"
                        className={styles.ptf_image_core}
                        layout="fill"
                        priority={true}
                    />
                ) : (
                    <div>
                        <p>画像を読み込めませんでした</p>
                    </div>
                )}
            </div>
            <div className={styles.ptf_workname_wrapper}>
                <p className={styles.ptf_workname_core}>
                    {portfolio.work_name}
                </p>
            </div>
            <div className={styles.ptf_username_wrapper}>
                <p className={styles.ptf_username_core}>{portfolio.username}</p>
            </div>
            <div
                className={styles.ptf_star_wrapper}
                style={{
                    display: 'flex'
                }}
            >
                <div className={styles.ptf_star_core}>
                    <StarIcon
                        sx={{
                            color: 'lime',
                            fontSize: resizeSmallIcon(15, 20, 27),
                            display: 'block'
                        }}
                    />
                </div>
                <div className={styles.ptf_star_reviewavg}>
                    {portfolio.review_avg}
                </div>
            </div>
        </div>
    )
}

export default PortfolioContainer
