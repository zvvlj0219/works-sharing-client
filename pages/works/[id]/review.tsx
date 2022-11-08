import Layout from '@components/Layout'
import mongoose from 'mongoose'
import { GetServerSidePropsContext } from 'next'
import Image from 'next/image'
import portfolioSchema from '@models/Portfoilo'
import db from '@config/db'
import type { Portfolio, Review } from '../../../types'
import { getImageBinaryData } from '@helpers/getImageBinaryData'
import { useRouter } from 'next/router'
import React, { useEffect, useState, useCallback } from 'react'
import { baseUrl } from '@config/index'
import TextareaField from '@components/textarea/TextareaField'
import { useSession, getSession } from 'next-auth/react'

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

const UploadReview = ({ portfolio }: Props) => {
    const { data: session, status } = useSession()
    const Router = useRouter()

    const [reviewStar, setReviewStar] = useState<number>(3)

    useEffect(() => {
        if (!portfolio || (!session && status === 'unauthenticated')) {
            Router.push('/404')
        }
    }, [portfolio, session, status, Router])

    const onChangeHandler = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            if (!e.target.value) return

            setReviewText(e.target.value)
        },
        []
    )

    const selectStar = (_star: number): void => {
        setReviewStar(_star)
    }

    const uploadReview = async () => {
        if (!portfolio || !session) return

        const star_sum = portfolio.review.reduce<number>(
            (prev: number, curr: Review) => {
                return prev + curr.star
            },
            0
        )
        const review_avg =
            Math.floor(
                ((star_sum + reviewStar) / portfolio.review.length) * 10
            ) / 10

        const reviewBody = {
            username: session.user?.name,
            text: reviewText,
            star: reviewStar,
            review_avg
        }

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reviewBody)
        }

        await fetch(`${baseUrl}/review/${portfolio._id}`, options)

        Router.push(`/works/${portfolio._id}/detail`)
    }

    const [reviewText, setReviewText] = useState<string>('')

    return (
        <Layout>
            this is UploadReview
            {portfolio ? (
                <>
                    <p>workname {portfolio.work_name}</p>
                    <Image
                        src={portfolio.image_preview_url}
                        alt=""
                        style={{
                            width: '150px',
                            height: 'auto',
                            display: 'block'
                        }}
                        width={150}
                        height={150}
                    />
                    <p>レビュー内容</p>
                    <div>
                        星<p>{reviewStar}</p>
                        <div onClick={() => selectStar(1)}>1</div>
                        <div onClick={() => selectStar(2)}>2</div>
                        <div onClick={() => selectStar(3)}>3</div>
                        <div onClick={() => selectStar(4)}>4</div>
                        <div onClick={() => selectStar(5)}>5</div>
                    </div>
                    <TextareaField
                        field_height={200}
                        field_width={300}
                        value={reviewText}
                        onChange={onChangeHandler}
                    />
                    <button type="button" onClick={() => uploadReview()}>
                        レビューする
                    </button>
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
    const { params, req } = ctx

    const session = await getSession({ req })

    if (!session) {
        return {
            redirect: {
                destination: '/auth/login'
            }
        }
    }

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

export default UploadReview
