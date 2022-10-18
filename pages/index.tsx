import Layout from '@components/Layout'
import fetch from 'node-fetch'
import { baseUrl } from '../config'
import db from '../config/db'
import type { BucketFile, Portfolio } from '../types'
import { getPortfolios } from '../helpers/getPortfolios'
import { getImageBinaryData } from '../helpers/getImageBinaryData'
import { ObjectId } from 'mongoose'
import { InferGetStaticPropsType, GetStaticPaths} from 'next'

interface Image {
    _id: ObjectId
    url: string
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

const Home = ({ portfolios, imageUrlArray}: Props) => {
    console.log(portfolios)
    console.log(imageUrlArray)
    return (
        <Layout>
            this is Home
        </Layout>
    )
}

export const getStaticProps = async () => {
    await db.connect()

    const portfolios = await getPortfolios()

    const mapResult = portfolios.map((work: Portfolio) => {
        return getImageBinaryData(work.image.name , work._id)
    })

    const getImageUrl = async () => {
        const image = await Promise.all(mapResult)
        return image
    }

    const imageUrlArray = await getImageUrl()
    
    await db.disconnect()

    return {
        props: {
            portfolios,
            imageUrlArray
        }
    }
}

export default Home
