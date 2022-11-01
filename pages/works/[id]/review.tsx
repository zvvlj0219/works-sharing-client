import Layout from '@components/Layout'
import mongoose, { ObjectId }  from 'mongoose'
import { GetServerSidePropsContext, InferGetStaticPropsType } from 'next'
import portfolioSchema from '@models/Portfoilo'
import db from '../../../config/db'
import type { Portfolio, Review } from '../../../types'
import { getImageBinaryData } from '../../../helpers/getImageBinaryData'
import { useRouter } from 'next/router'
import React, { useEffect, useState, useCallback } from 'react'
import {baseUrl} from '../../../config'
import TextareaField from '../../../components/textarea/TextareaField'
import { useSession, signOut, getSession  } from 'next-auth/react'

type Props = {
    portfolio: {
        image_preview_url: string;
        _id: mongoose.Schema.Types.ObjectId;
        image: {
            name: string;
        };
        username: string;
        review: Review[];
        work_url: string;
        work_name: string;
        description: string;
        review_avg: number;
        like: number;
        dislike: number;
    } | undefined
}

const UploadReview = ({ portfolio }: Props) => {
    const { data: session, status } = useSession()

    console.log(session)
    console.log(status)

    const Router = useRouter()

    const [reviewStar, setReviewStar] = useState<number>(3)

    useEffect(() => {
        if (!portfolio || (!session && status === 'unauthenticated')) {
            Router.push('/404')
        }
    }, [portfolio, session, status])

    const onChangeHandler = useCallback((e:React.ChangeEvent<HTMLTextAreaElement>) => {
        if(!e.target.value) return

        setReviewText(e.target.value)
    }, [])

    const selectStar = (): void => {
        // review_avgを計算する処理
        // setreviewStar
    }

    const uploadReview = async () => {
        if(!portfolio || !session) return

        const newReview = {
            username: session.user?.name,
            text: reviewText,
            star: reviewStar
        }   

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newReview)
        }

        await fetch(`${baseUrl}/review/${portfolio._id}`, options)

        Router.push(`/works/${portfolio._id}/detail`)
    }

    const [reviewText, setReviewText] = useState<string>('')

    return (
        <Layout>
            this is UploadReview
            {
                portfolio ? (
                    <>
                        <p>workname {portfolio.work_name}</p>
                        <img
                            src={portfolio.image_preview_url}
                            alt=""
                            style={{ width: '150px', height: 'auto', display: 'block' }}
                        />
                        <p>レビュー内容</p>
                        <TextareaField
                            field_height={200}
                            field_width={300}
                            value={reviewText}
                            onChange={onChangeHandler}
                        />
                        <button
                            type='button'
                            onClick={() => uploadReview()}
                        >
                            レビューする
                        </button>
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
    const { 
        params,
        req
    } = ctx

    const session = await getSession({ req })

    if (!session) {
        return {
            redirect: {
                destination: '/auth/login'
            }
        }
    }

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


export default UploadReview
