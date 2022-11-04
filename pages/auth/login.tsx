import { signIn, getProviders } from "next-auth/react";
import Layout from "@components/Layout";
import { client_baseUrl} from '@config/index'


type Providers = {
    providers: {
        [key: string]: {
            id: string ,
            name: string ,
            type: string ,
            signinUrl: string ,
            callbackUrl: string 
        }
    }
}

const Login = ({ providers }: Providers) => {
    const onClick = async (id: string) => {
        await signIn(id, {
            callbackUrl: client_baseUrl
        })
    }

    return (
        <Layout>
            <div style={{width: '30%', margin: '0 auto'}}>
                {Object.values(providers).map((provider) => {
                    return (
                    <div key={provider.name} style={{fontSize: '5rem'}}>
                        <button
                            onClick={() => onClick(provider.id)}
                            style={{
                                color: 'black',
                                padding: '2rem 4rem',
                                width: '300px',
                                margin: '4rem',
                                fontSize: '1.5rem',
                                display: 'block',
                            }}
                        >
                        Sign in with {provider.name}
                        </button>
                    </div>
                    );
                })}
            </div>
        </Layout>
    )
}

export const getServerSideProps = async () => {
    const providers = await getProviders()

    return {
        props: {
            providers
        }
    };
}

export default Login