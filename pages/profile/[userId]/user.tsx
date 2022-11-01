import Layout from '@components/Layout'
import { signIn, getProviders, getSession, getCsrfToken } from "next-auth/react";
import type { GetServerSidePropsContext} from 'next'
import ProfileScreen from '../../../components/porfile/ProfileScreen'
import portfolioSchema from '@models/Portfoilo'
import type { Portfolio, Review } from '../../../types'
import { getImageBinaryData } from '../../../helpers/getImageBinaryData'
import { ObjectId } from 'mongoose'
import PortfolioContainer from '@components/portfolio/Portfolio'



import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useEffect, useRef } from 'react'
import db from '@config/db';

interface Image {
    _id: ObjectId
    image_preview_url?: string
}

type Props = {
    portfolioList : (Portfolio & Image)[]
}


const UserProfile = ({
    portfolioList
}: Props) => {
    const { data: session, status } = useSession()
    const Router = useRouter()

    console.log(session)
    console.log(status)

    console.log(portfolioList)

    useEffect(() => {
        if(!session && status !== 'loading') {
            Router.push('/auth/login')
        }
    }, [session])

    const onClickhandler = (_id: ObjectId) => {
        Router.push(`/works/${_id}/detail`)
    }


    return (
        <Layout>
            this is UserProfile
            {
                session && (
                    <>
                        <ProfileScreen
                            username={session?.user?.name!}
                            use_image_url={session.user?.image!}
                        />
                        <div className='section portfolio_list'>
                        {portfolioList.map((portfolio) => (
                            <div
                                onClick={() => onClickhandler(portfolio._id)}
                                key={String(portfolio._id)}
                                className='portfolio_wrapper root'
                            >
                                <PortfolioContainer
                                    _id={portfolio._id}
                                    image_preview_url={portfolio.image_preview_url} 
                                    username={portfolio.username}
                                    work_name={portfolio.work_name}
                                    review_avg={portfolio.review_avg}
                                />
                        </div>
                ))}
            </div>

                    </>
                )
            }

        </Layout>
    )
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const { req } = context
    const session = await getSession({ req });

    if (!session) {
        return {
            redirect: { 
                destination: "/auth/login"
            },
        };
    }

    const username = session.user?.name

    if(!username){
        return {
            redirect: { 
                destination: "/auth/login"
            }
        }
    }
    
    await db.connect()

    const portfolioDocuments = await portfolioSchema.find({ username }).lean()

    const convertedPortfolios = portfolioDocuments
        ? (portfolioDocuments.map((doc: Portfolio) => {
              return db.convertDocToObj(doc)
          }) as Portfolio[])
        : []


    const mapResult = convertedPortfolios.map((work: Portfolio) => {
        return getImageBinaryData(work.image.name, work._id)
    })

    const getImageUrl = async () => {
        const imageObj = await Promise.all(mapResult)
        return imageObj as Image[]
    }

    const imageUrlArray = await getImageUrl()
    
    await db.disconnect()

    const portfolioList = convertedPortfolios.map((portfolio: Portfolio) => {
        const imageObj = imageUrlArray.find((image: Image) => {
            if (portfolio._id === image._id) return image
        })

        if(!imageObj){
            return {
                ...portfolio,
                image_preview_url: undefined
            } as Portfolio & Image
        }

        return {
            ...portfolio,
            image_preview_url: imageObj.image_preview_url
        } as Portfolio & Image
    })

    return {
        props: {
            portfolioList
        }
    }
}


export default UserProfile
