import { ObjectId } from 'mongoose'
import { InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/router'
import type { Portfolio } from '../types'
import Layout from '@components/Layout'
import { getPortfolios } from '@helpers/getPortfolios'
import { getImageBinaryData } from '@helpers/getImageBinaryData'
import PortfolioContainer from '@components/portfolio/Portfolio'
import db from '@config/db'
import styles from '@styles/home.module.scss'

interface Image {
    _id: ObjectId
    image_preview_url?: string
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

const Home = ({ portfolioList }: Props) => {
    const Router = useRouter()

    const onClickhandler = (_id: ObjectId) => {
        Router.push(`/works/${_id}/detail`)
    }

    return (
        <Layout>
            <div className={styles.section_portfolio_list}>
                {portfolioList.map((portfolio) => (
                    <div
                        onClick={() => onClickhandler(portfolio._id)}
                        key={String(portfolio._id)}
                        className={styles.portfolio_wrapper_root}
                    >
                        <PortfolioContainer
                            _id={portfolio._id}
                            image_preview_url={portfolio.image_preview_url}
                            username={portfolio.username}
                            work_name={portfolio.work_name}
                            review_avg={portfolio.review_avg}
                        />
                    </div>
                ))}
            </div>
        </Layout>
    )
}

export const getStaticProps = async () => {
    await db.connect()

    const portfolioDocuments = await getPortfolios()

    const mapResult = portfolioDocuments.map((work: Portfolio) => {
        return getImageBinaryData(work.image.name, work._id)
    })

    const getImageUrl = async () => {
        const imageObj = await Promise.all(mapResult)
        return imageObj as Image[]
    }

    const imageUrlArray = await getImageUrl()

    await db.disconnect()

    const portfolioList = portfolioDocuments.map((portfolio: Portfolio) => {
        const imageObj = imageUrlArray.find((image: Image) => {
            if (portfolio._id === image._id) return image
        })

        if (!imageObj) {
            return {
                ...portfolio,
                image_preview_url: undefined
            } as Portfolio & Image
        }

        return {
            ...portfolio,
            image_preview_url: imageObj.image_preview_url
        } as Portfolio & Image
    })

    return {
        props: {
            portfolioList
        }
    }
}

export default Home
