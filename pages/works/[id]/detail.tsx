import Layout from "@components/Layout"
import { ObjectId } from "mongoose"
import { GetServerSidePropsContext } from "next"

const PortfolioDetail = () => {
    return (
        <Layout>
            this is PortfolioDetail
        </Layout>
    )
}

export const getServerSideProps = async (
    ctx: GetServerSidePropsContext<{ id: string}>
) => {
    const { params } = ctx

    console.log(params?.id) // idでポートフォリオを検索

    return {
        props: {
            sample: ''
        }
    }

}

export default PortfolioDetail
