import { ObjectId } from 'mongoose'
import styles from './portfolio.module.css'
import StarIcon from '@mui/icons-material/Star';
import {useResizeIcon} from '../../helpers/useResizeIcon'

type PortfolioProps = {
    _id: ObjectId
    image_preview_url?: string,
    username: string,
    work_name: string,
    review_avg: number
}

const PortfolioContainer = (portfolio: PortfolioProps) => {
    return (
        <div
            className={styles.ptf_container}
        >
            <div className={styles.ptf_image_wrapper}>
                {
                    portfolio.image_preview_url ? (
                        <img
                            src={portfolio.image_preview_url}
                            alt='image'
                            className={styles.ptf_image_core}
                        />
                    ) : (
                        <div>
                            <p>画像を読み込めませんでした</p>
                        </div>
                    )
                }
            </div>
            <div className={styles.ptf_workname_wrapper}>
                <p className={styles.ptf_workname_core}>{portfolio.work_name}</p>
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
                            fontSize: 25
                        }}
                    />
                </div>
                <div className={styles.ptf_star_reviewavg}>{portfolio.review_avg}</div>
            </div>
        </div>
    )
}

export default PortfolioContainer
