import { GetServerSidePropsContext } from 'next'
import mongoose from 'mongoose'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Image from 'next/image'
import portfolioSchema from '@models/Portfoilo'
import Layout from '@components/Layout'
import db from '@config/db'
import type { Portfolio } from '../../../types'
import { getImageBinaryData } from '@helpers/getImageBinaryData'
import type { Review } from '../../../types'
import { baseUrl } from '@config/index'

type Props = {
    portfolio:
        | {
              image_preview_url: string
              _id: mongoose.Schema.Types.ObjectId
              image: {
                  name: string
              }
              username: string
              review: Review[]
              work_url: string
              work_name: string
              description: string
              review_avg: number
              like: number
              dislike: number
          }
        | undefined
}

const PortfolioDetail = ({ portfolio }: Props) => {
    const [_portfolio, setPortfolio] = useState<Props['portfolio']>(portfolio)

    const Router = useRouter()

    const pushLikeButton = async () => {
        if (!portfolio) return
        const _newLike = {
            newlikeCount: portfolio.like + 1
        }

        const res = await fetch(`${baseUrl}/review/like/${portfolio._id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(_newLike)
        })
        const { result } = (await res.json()) as { result: Portfolio }
        if (_portfolio) {
            setPortfolio({
                ..._portfolio,
                like: result.like
            })
        }
    }

    const pushDislikeButton = async () => {
        if (!portfolio) return
        const _newDislike = {
            newdislikeCount: portfolio.dislike + 1
        }
        const res = await fetch(`${baseUrl}/review/dislike/${portfolio._id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(_newDislike)
        })
        const { result } = (await res.json()) as { result: Portfolio }
        if (_portfolio) {
            setPortfolio({
                ..._portfolio,
                dislike: result.dislike
            })
        }
        console.log(result)
    }

    useEffect(() => {
        if (!portfolio) {
            Router.push('/404')
        }
    }, [portfolio, Router])

    return (
        <Layout>
            this is PortfolioDetail
            {_portfolio ? (
                <>
                    <p>workname = {_portfolio.work_name}</p>
                    <Image
                        src={_portfolio.image_preview_url}
                        alt=""
                        style={{
                            width: '150px',
                            height: 'auto',
                            display: 'block'
                        }}
                        width={150}
                        height={150}
                    />
                    <hr />
                    <div>
                        <p>like dislike</p>
                        <p onClick={() => pushLikeButton()}>
                            いいね:{_portfolio.like}
                        </p>
                        <p onClick={() => pushDislikeButton()}>
                            いまいち:{_portfolio.dislike}
                        </p>
                    </div>
                    <hr />
                    <Link href={`/works/${String(_portfolio._id)}/review`}>
                        <a>reviewを書く</a>
                    </Link>
                    <div className="review list">
                        {_portfolio.review.map((rev: Review) => (
                            <div key={String(rev.createdAt)}>
                                <div>星{rev.star}</div>
                                <div>名前:{rev.username}</div>
                                <div>内容:{rev.text}</div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <p>読み込めませんでした</p>
            )}
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
                portfolio: undefined
            }
        }
    }

    await db.connect()

    const portfolioDocument = await portfolioSchema.findById(params.id).lean()

    if (!portfolioDocument)
        return {
            props: {
                portfolio: undefined
            }
        }

    const convertedPortfolio = db.convertDocToObj<Portfolio>(
        portfolioDocument
    ) as Portfolio

    const imageObj = await getImageBinaryData(
        convertedPortfolio.image.name,
        params.id
    )

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
