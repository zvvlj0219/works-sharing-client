import Layout from '@components/Layout'
import { ObjectId } from 'mongoose'
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import portfolioSchema from '@models/Portfoilo'
import db from '../../../config/db'
import type { Portfolio } from '../../../types'
import { getImageBinaryData } from '../../../helpers/getImageBinaryData'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

interface Image {
    id: string | ObjectId
    url: string
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

const UploadReview = ({ portfolio, imageObj }: Props) => {
    const Router = useRouter()

    console.log(portfolio)
    console.log(imageObj)

    useEffect(() => {
        if (!portfolio) {
            Router.push('/404')
        }
    }, [])

    const [imageSrc, setImageSrc] = useState<Image | null>(imageObj)

    return (
        <Layout>
            this is UploadReview
            <p>workname {portfolio?.work_name}</p>
            <img
                src={imageSrc?.url}
                alt=""
                style={{ width: '150px', height: 'auto', display: 'block' }}
            />
        </Layout>
    )
}

export const getStaticPaths = async () => {
    await db.connect()

    const portfolioDocuments = await portfolioSchema.find().lean()

    const portfolioList = portfolioDocuments
        ? (portfolioDocuments.map((doc: Portfolio) => {
              return db.convertDocToObj(doc)
          }) as Portfolio[])
        : []

    const paths = portfolioList.map((work: Portfolio) => {
        return {
            params: {
                id: work._id
            }
        }
    })

    await db.disconnect()

    return {
        paths,
        fallback: false
    }
}

export const getStaticProps = async (
    ctx: GetStaticPropsContext<{ id: string }>
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

export default UploadReview
