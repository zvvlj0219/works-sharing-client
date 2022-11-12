import { GetServerSidePropsContext } from 'next'
import mongoose from 'mongoose'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSession, getSession } from 'next-auth/react'
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
              like: {
                id: string
              }[]
              dislike: {
                id: string
              }[]
          }
        | undefined
}

const PortfolioDetail = ({ portfolio }: Props) => {
    const { data: session, status } = useSession()
    const Router = useRouter()

    const [_portfolio, setPortfolio] = useState<Props['portfolio']>(portfolio)

    console.log(_portfolio)

    const pushLikeButton = async () => {
        if (!_portfolio) return

        if (!session && status !== 'loading') {
            Router.push('/auth/login')
            return
        }

        const newLike = {
            id: session?.user?.email
        }

        const res = await fetch(`${baseUrl}/review/like/${_portfolio._id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({newLike})
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
        if (!_portfolio) return

        if (!session && status !== 'loading') {
            Router.push('/auth/login')
            return
        }

        const newDislike = {
            id: session?.user?.email
        }
        const res = await fetch(`${baseUrl}/review/dislike/${_portfolio._id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({newDislike})
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

    const checkLike = ():boolean => {
        if (!_portfolio) return false

        const index = _portfolio.like.findIndex(obj=> {
           return obj.id === session?.user?.email
        })

        if(index !== -1){
            return true
        } else {
            return false
        }
    }

    const checkDisLike = ():boolean => {
        if (!_portfolio) return false

        const index = _portfolio.dislike.findIndex(obj=> {
           return obj.id === session?.user?.email
        })

        if(index !== -1){
            return true
        } else {
            return false
        }
    }

    useEffect(() => {
        if (!_portfolio) {
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
                            いいね:{_portfolio.like.length}
                        </p>
                        <p  style={{color:'red'}}>{checkLike() && 'いいね！'}</p>
                        <p onClick={() => pushDislikeButton()}>
                            いまいち:{_portfolio.dislike.length}
                        </p>
                        <p style={{color:'blue'}}>{checkDisLike() && 'いまいち！'}</p>
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
