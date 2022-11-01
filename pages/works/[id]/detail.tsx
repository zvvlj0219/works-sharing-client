import Layout from '@components/Layout'
import mongoose, { ObjectId } from 'mongoose'
import { GetServerSidePropsContext } from 'next'
import portfolioSchema from '@models/Portfoilo'
import db from '../../../config/db'
import type { Portfolio } from '../../../types'
import { InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { getImageBinaryData } from '../../../helpers/getImageBinaryData'
import Link from 'next/link'
import type {Review} from '../../../types'

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

const PortfolioDetail = ({portfolio}: Props) => {
    const Router = useRouter()

    useEffect(() => {
        if (!portfolio) {
            Router.push('/404')
        }
    }, [portfolio])

    return (
        <Layout>
            this is PortfolioDetail
            {
                portfolio ? (
                    <>
                        <p>workname = {portfolio.work_name}</p>
                        <img
                            src={portfolio.image_preview_url}
                            alt=""
                            style={{ width: '150px', height: 'auto', display: 'block' }}
                        />
                        <Link href={`/works/${String(portfolio._id)}/review`}>
                            <a>
                                reviewを書く
                            </a>
                        </Link>
                        <div className='review list'>
                            {
                                portfolio.review.map((rev:Review) => (
                                    <div key={String(rev._id)}>
                                        <div>星{rev.star}</div>
                                        <div>名前:{rev.username}</div>
                                        <div>内容:{rev.text}</div>
                                    </div>
                                ))
                            }
                        </div>
                    </>
                ) : (
                    <p>読み込めませんでした</p>
                )
            }
        </Layout>
    )
}

export const getServerSideProps = async (
    ctx: GetServerSidePropsContext<{ id: string }>
) => {
    const { params } = ctx

    if(!params){
        return {
            props: {
                portfolio: undefined
            }
        }
    }

    await db.connect()

    const portfolioDocument = await portfolioSchema.findById(params.id).lean()

    const convertedPortfolio = db.convertDocToObj(portfolioDocument) as Portfolio

    const imageObj = await getImageBinaryData(convertedPortfolio.image.name, params.id)

    await db.disconnect()

    const portfolio = {
        ...convertedPortfolio,
        image_preview_url: imageObj.image_preview_url
    }

    return {
        props: {
            portfolio
        }
    }
}

export default PortfolioDetail
