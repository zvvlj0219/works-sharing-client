import Layout from '@components/Layout'
import { signIn, getProviders, getSession, getCsrfToken } from "next-auth/react";
import type { GetServerSidePropsContext} from 'next'

import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useEffect, useRef } from 'react'


const UserProfile = () => {
    return (<Layout>this is UserProfile</Layout>)
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

    return {
        props: {
        }
    };
}


export default UserProfile
