import Layout from '@components/Layout'
import { ObjectId } from 'mongoose'
import { GetServerSidePropsContext } from 'next'
import portfolioSchema from '@models/Portfoilo'
import db from '../../../config/db'
import type { Portfolio } from '../../../types'
import { InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { getImageBinaryData } from '../../../helpers/getImageBinaryData'

interface Image {
    id: string | ObjectId
    url: string
}

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

const PortfolioDetail = ({ portfolio, imageObj }: Props) => {
    const Router = useRouter()

    const [imageSrc, setImageSrc] = useState<Image | null>(imageObj)

    useEffect(() => {
        if (!portfolio) {
            Router.push('/404')
        }
    }, [])

    return (
        <Layout>
            this is PortfolioDetail
            <p>workname = {portfolio?.work_name}</p>
            <img
                src={imageSrc?.url}
                alt=""
                style={{ width: '150px', height: 'auto', display: 'block' }}
            />
        </Layout>
    )
}

export const getServerSideProps = async (
    ctx: GetServerSidePropsContext<{ id: string }>
) => {
    const { params } = ctx

    if (!params) {
        return {
            props: {
                portfolio: null,
                imageObj: null
            }
        }
    }

    await db.connect()

    const portfolioDocument = await portfolioSchema.findById(params.id).lean()

    if (!portfolioDocument) {
        return {
            props: {
                portfolio: null,
                imageObj: null
            }
        }
    }

    const portfolio = db.convertDocToObj(portfolioDocument) as Portfolio

    const imageObj = await getImageBinaryData(portfolio.image.name, params.id)

    await db.disconnect()

    return {
        props: {
            portfolio,
            imageObj
        }
    }
}

export default PortfolioDetail
