import { useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '@components/Layout'
import fetch from 'node-fetch'
import { baseUrl } from '../config'
import db from '../config/db'
import type { BucketFile, Portfolio } from '../types'
import { getPortfolios } from '../helpers/getPortfolios'
import { getImageBinaryData } from '../helpers/getImageBinaryData'
import { ObjectId } from 'mongoose'
import { InferGetStaticPropsType } from 'next'
import portfolioSchema from '../models/Portfoilo'

interface Image {
    _id: ObjectId
    url: string
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

const Home = ({ portfolioList, imageUrlArray }: Props) => {
    console.log(portfolioList)
    console.log(imageUrlArray)

    const Router = useRouter()

    const onClickhandler = (_id: ObjectId) => {
        Router.push(`/works/${_id}/detail`)
    }

    return (
        <Layout>
            <div>
                {portfolioList.map((portfolio: Portfolio) => (
                    <div
                        style={{
                            width: '300px',
                            height: '200px',
                            border: '1px solid black'
                        }}
                        key={String(portfolio._id)}
                        onClick={() => onClickhandler(portfolio._id)}
                    >
                        <p>{portfolio.work_name}</p>
                        <p>{portfolio.work_url}</p>
                    </div>
                ))}
            </div>
        </Layout>
    )
}

export const getStaticProps = async () => {
    await db.connect()

    const portfolioDocuments = await getPortfolios()

    const portfolioList = portfolioDocuments
        ? (portfolioDocuments.map((doc: Portfolio) => {
              return db.convertDocToObj(doc)
          }) as Portfolio[])
        : []

    const mapResult = portfolioList.map((work: Portfolio) => {
        return getImageBinaryData(work.image.name, work._id)
    })

    const getImageUrl = async () => {
        const imageObj = await Promise.all(mapResult)
        return imageObj
    }

    const imageUrlArray = await getImageUrl()

    await db.disconnect()

    return {
        props: {
            portfolioList,
            imageUrlArray
        }
    }
}

export default Home
