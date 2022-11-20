import Layout from '@components/Layout'
import mongoose from 'mongoose'
import { GetServerSidePropsContext } from 'next'
import Image from 'next/image'
import portfolioSchema from '@models/Portfoilo'
import db from '@config/db'
import type { Portfolio, Review } from '../../../types'
import { getImageBinaryData } from '@helpers/getImageBinaryData'
import { useResizeIcon } from '@helpers/useResizeIcon'
import { useRouter } from 'next/router'
import React, { useEffect, useState, useCallback } from 'react'
import { baseUrl } from '@config/index'
import TextareaField from '@components/textarea/TextareaField'
import { useSession, getSession } from 'next-auth/react'
import EditIcon from '@mui/icons-material/Edit'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import StarIcon from '@mui/icons-material/Star'
import { Divider } from '@mui/material'
import styles from '@styles/review.module.scss'

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
                  email: string
              }[]
              dislike: {
                  email: string
              }[]
          }
        | undefined
}

const UploadReview = ({ portfolio }: Props) => {
    const { data: session, status } = useSession()
    const Router = useRouter()
    const { resizeSmallIcon } = useResizeIcon()

    const [reviewStar, setReviewStar] = useState<number>(3)
    const [reviewText, setReviewText] = useState<string>('')
    const [hoverStar, setHoverStar] = useState<number>(0)

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
        const review_avg = portfolio.review.length
            ? Math.floor(
                  ((star_sum + reviewStar) / portfolio.review.length) * 10
              ) / 10
            : reviewStar

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

    useEffect(() => {
        if (!portfolio) Router.push('/404')
    }, [portfolio, Router])

    return (
        <Layout>
            {portfolio && (
                <div className={styles.section_review_page}>
                    <div className={styles.review_image_container}>
                        <Image
                            src={portfolio.image_preview_url}
                            className={styles.review_image_core}
                            alt=""
                            layout="fill"
                            priority={true}
                        />
                    </div>

                    <div className={styles.review_head_containre}>
                        <div className={styles.workname}>
                            {portfolio.work_name}
                        </div>
                        <div className={styles.username}>
                            {portfolio.username}
                        </div>
                    </div>

                    <Divider />

                    <div className={styles.review_form_container}>
                        <p>
                            <EditIcon
                                sx={{
                                    color: 'limegreen',
                                    fontSize: 27
                                }}
                            />
                            レビュー内容
                        </p>
                        <div
                            onMouseOut={() => setHoverStar(0)}
                            className={styles.review_star_group}
                        >
                            {[1, 2, 3, 4, 5].map((num) => (
                                <div
                                    onClick={() => selectStar(num)}
                                    onMouseMove={() => setHoverStar(num)}
                                    key={num}
                                >
                                    {hoverStar < num && reviewStar < num ? (
                                        <StarBorderIcon
                                            sx={{
                                                color: 'orange',
                                                fontSize: resizeSmallIcon(
                                                    40,
                                                    50,
                                                    60
                                                )
                                            }}
                                        />
                                    ) : (
                                        <StarIcon
                                            sx={{
                                                color: 'orange',
                                                fontSize: resizeSmallIcon(
                                                    40,
                                                    50,
                                                    60
                                                )
                                            }}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                        <TextareaField
                            className={styles.textarea_field}
                            value={reviewText}
                            onChange={onChangeHandler}
                        />
                        <div className={styles.review_button_container}>
                            <button
                                type="button"
                                onClick={() => uploadReview()}
                            >
                                レビューする
                            </button>
                        </div>
                    </div>
                </div>
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
