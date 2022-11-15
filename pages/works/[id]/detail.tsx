import { GetServerSidePropsContext } from 'next'
import mongoose from 'mongoose'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import portfolioSchema from '@models/Portfoilo'
import Layout from '@components/Layout'
import db from '@config/db'
import type { Portfolio } from '../../../types'
import { getImageBinaryData } from '@helpers/getImageBinaryData'
import { formatStringDate } from '@helpers/formatStringDate'
import { useResizeIcon } from '@helpers/useResizeIcon'
import type { Review } from '../../../types'
import { baseUrl } from '@config/index'
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import StarIcon from '@mui/icons-material/Star';
import styles from '@styles/detail.module.scss'
import { Divider } from '@mui/material'

type Props = {
    portfolio?:
         {
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
}

const PortfolioDetail = ({ portfolio }: Props) => {
    const { data: session, status } = useSession()
    const Router = useRouter()
    const { resizeSmallIcon } = useResizeIcon()

    const [_portfolio, setPortfolio] = useState<Props['portfolio']>(portfolio)

    const pushLikeButton = async () => {
        if (!_portfolio) return

        if (!session && status !== 'loading') {
            Router.push('/auth/login')
            return
        }

        const newLike = {
            email: session?.user?.email
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
                like: result.like,
                dislike: result.dislike
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
            email: session?.user?.email
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
                like: result.like,
                dislike: result.dislike
            })
        }
    }

    const checkLike = ():boolean => {
        if (!_portfolio) return false

        const index = _portfolio.like.findIndex(obj=> {
           return obj.email === session?.user?.email
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
           return obj.email === session?.user?.email
        })

        if(index !== -1){
            return true
        } else {
            return false
        }
    }

    const displayReviewStar = (count:number):JSX.Element => {
        let StarIconGroup = <></>
        for(let i=0; i < count; i++) {
            StarIconGroup = (
                <>
                    {StarIconGroup}
                    <StarIcon
                        sx={{
                            color: 'darkorange',
                            fontSize: resizeSmallIcon(10,20,25)
                        }}
                    />
                </>
            )
        }
        return StarIconGroup
    }

    useEffect(() => {
        if (!_portfolio) {
            Router.push('/404')
        }
    }, [portfolio, Router])

    return (
        <Layout>
            {_portfolio && (
                <div className={styles.section_detail_page}>
                    <div className={styles.detail_image_container}>
                        <Image
                            src={_portfolio.image_preview_url}
                            className={styles.detail_image_core}
                            alt=""
                            layout="fill"
                            priority={true}
                        />
                    </div>
                    <div className={styles.detail_head_container}>
                        <div className={styles.user_info_wrapper}>
                            <div className={styles.portfolio_name}>{_portfolio.work_name}</div>
                            <div className={styles.username}>{_portfolio.username}</div>
                        </div>
                        <div className={styles.detail_thumb_container}>
                            <div
                                onClick={() => pushLikeButton()}
                                className={styles.detail_thumbup_core}
                            >
                                {
                                    checkLike()
                                    ? <ThumbUpIcon />
                                    : <ThumbUpOffAltIcon />
                                }
                                
                                <div
                                    className={styles.like_couunt}
                                >{_portfolio.like.length}</div>
                            </div>
                            <div
                                className={styles.thumbdown_core}
                                onClick={() => pushDislikeButton()}
                            >
                                {
                                    checkDisLike()
                                    ? <ThumbDownIcon />
                                    : <ThumbDownOffAltIcon />
                                }
                                
                                
                            </div>
                        </div>
                    </div>
                    <Divider />
                    <div className={styles.detail_description_container}>
                        <p>概要説明</p><br />
                        {_portfolio.description}
                        <br />
                        <p className={styles.url_link}>
                            URL:&nbsp;
                            <Link href={_portfolio.work_url}>
                                <a>{_portfolio.work_url}</a>
                            </Link>
                        </p>
                    </div>
                    <Divider />
                    <div className={styles.review_head_container}>
                        <div className={styles.review_heading}>
                            <AutoAwesomeIcon
                                sx={{
                                    color: 'orange'
                                }}
                            />
                            ユーザーレビュー
                        </div>
                        <div className={styles.review_link}>
                            <Link href={`/works/${String(_portfolio._id)}/review`}>
                                <a>レビューを書く</a>
                            </Link>
                        </div>
                    </div>
                    <div className={styles.reviewlist_container}>
                        {
                            _portfolio.review.length !== 0 ?
                            _portfolio.review.map((rev: Review) => (
                                <div
                                    key={String(rev.createdAt)}
                                    className={styles.review_wrapper}
                                >
                                    <div className={styles.star_icon_group_container}>
                                        <div>{displayReviewStar(rev.star)}</div>
                                        <div className={styles.star_icon_username}>
                                            {rev.username}
                                        </div>
                                        <div className={styles.created_date}>{formatStringDate(rev.createdAt)}</div>
                                    </div>
                                    <div className={styles.review_text}>{rev.text}</div>
                                </div>
                            )) : (
                                <p>まだレビューがありません</p>
                            )
                        }
                    </div>
                </div>
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
