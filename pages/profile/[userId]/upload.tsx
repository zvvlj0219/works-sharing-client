import Layout from '@components/Layout'
import type { GetServerSidePropsContext } from 'next'
import type { Portfolio, UploadFile } from '../../../types'
import { getSession } from 'next-auth/react'
import ProfileScreen from '@components/porfile/ProfileScreen'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useEffect, useRef, useState, useCallback } from 'react'
import TextareaField from '@components/textarea/TextareaField'
import { baseUrl } from '@config/index'

interface Image {
    id: string
    file: File
}
interface Preview {
    id: string
    url: FileReader['result'] | undefined
}

interface PostBody {
    image: {
        name: string
    }
    username: string
    work_url: string
    work_name: string
    description: string
}

interface UploadImageOption {
    method: string
    headers?: {
        [key: string]: string
    }
    body: FormData
}

const UploadPortfolio = () => {
    const { data: session, status } = useSession()
    const Router = useRouter()
    const [currentPath, setCurrenPath] = useState<'user' | 'upload'>('user')

    const fileInputElement = useRef<HTMLInputElement>(null)
    const [selectedfile, setSelectedFile] = useState<Image | null>(null)
    const [previewSrc, setPreviewSrc] = useState<Preview | null>(null)
    const [isPreviewActive, setIsPreviewActive] = useState<boolean>(false)

    const [worknameField, setWorknameField] = useState<string>('')
    const [urlField, setUrlFeild] = useState<string>('')
    const [describeText, setDescribeText] = useState<string>('')

    const selectImageHandler = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        e.preventDefault()

        setIsPreviewActive(true)

        if (fileInputElement.current === null) return
        const FileObject = (fileInputElement.current.files as FileList)[0]

        setSelectedFile({
            id: FileObject.name,
            file: FileObject
        })

        previewSelectedImage({
            id: FileObject.name,
            file: FileObject
        })
    }

    const cancelPreviewImage = () => {
        setIsPreviewActive(false)
        setPreviewSrc(null)
    }

    const onChangeURLHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.value) return setUrlFeild('')
        setUrlFeild(e.target.value)
    }

    const onChangeDescribeHandler = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            if (!e.target.value) return setDescribeText('')

            setDescribeText(e.target.value)
        },
        []
    )

    const onChangeworknameHandler = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (!e.target.value) return setWorknameField('')
        setWorknameField(e.target.value)
    }

    const previewSelectedImage = (img: Image) => {
        if (!img && !isPreviewActive) return

        const reader = new FileReader()

        reader.readAsDataURL(img.file)

        reader.onload = (event) => {
            setPreviewSrc({
                id: event.target?.result as string,
                url: event.target?.result
            })
        }
    }

    const uploadPortfolio = async () => {
        if (!selectedfile || !session?.user?.name) return

        //画像送信
        const formData = new FormData()
        formData.append('upload-image-name', selectedfile.file)

        const postImageOptions: UploadImageOption = {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            body: formData
        }

        // fetchでバイナリデータを送信する際
        // boundaryを正常に設定させるために
        // Content-Typeを削除する
        if (typeof postImageOptions.headers === 'undefined') return
        delete postImageOptions.headers['Content-Type']

        // api request ここで画像をgridfsにアップロード
        const postImageResponse = await fetch(
            `${baseUrl}/upload/save_image`,
            postImageOptions
        )
        const { result_image } = (await postImageResponse.json()) as {
            result_image: UploadFile
        }

        if (session?.user?.name) throw new Error('not found user')
        // ポートフォリオドキュメントを作成する
        const portfolioData: PostBody = {
            image: {
                name: result_image.filename
            },
            username: session.user.name,
            work_url: urlField,
            work_name: worknameField,
            description: describeText
        }

        // api request ここでデータをmongodbに保存する
        const postPortfolioResponse = await fetch(
            `${baseUrl}/upload/save_portfolio`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ portfolioData })
            }
        )
        const { result } = (await postPortfolioResponse.json()) as {
            result: Portfolio
        }

        console.log(result)
    }

    useEffect(() => {
        if (!session && status !== 'loading') {
            Router.push('/auth/login')
        }
        const path = Router.pathname.split('/')[3] as 'user' | 'upload'
        setCurrenPath(path)
    }, [session, status, Router])

    return (
        <Layout>
            this is UploadPortfolio
            {session && (
                <div>
                    {session.user?.name && session.user?.image && (
                        <ProfileScreen
                            username={session.user.name}
                            use_image_url={session.user.image}
                            path={currentPath}
                        />
                    )}
                    <div>
                        <div className="upload_image_form_container">
                            <div>
                                <form
                                    className="select_image"
                                    encType="multipart/form-data"
                                >
                                    {!isPreviewActive && (
                                        <label htmlFor="upload-image-id">
                                            select images
                                            <input
                                                type="file"
                                                accept="image/*"
                                                name="upload-image-name"
                                                id="upload-image-id"
                                                ref={fileInputElement}
                                                onChange={(
                                                    event: React.ChangeEvent<HTMLInputElement>
                                                ) => selectImageHandler(event)}
                                            />
                                        </label>
                                    )}
                                    {previewSrc && isPreviewActive && (
                                        <div className="preview_image_container">
                                            <p>preview</p>
                                            {previewSrc ? (
                                                <>
                                                    <div className="preview_image_lists">
                                                        <div>
                                                            <Image
                                                                src={String(
                                                                    previewSrc.url
                                                                )}
                                                                alt=""
                                                                style={{
                                                                    display:
                                                                        'black',
                                                                    width: '100px'
                                                                }}
                                                                width={100}
                                                                height={100}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p
                                                            onClick={() =>
                                                                cancelPreviewImage()
                                                            }
                                                        >
                                                            cancel
                                                        </p>
                                                    </div>
                                                </>
                                            ) : (
                                                <div>
                                                    <p>
                                                        faild to preview image
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className="url container">
                        <p>ここに作品名</p>
                        <input
                            type="text"
                            value={worknameField}
                            onChange={(
                                event: React.ChangeEvent<HTMLInputElement>
                            ) => onChangeworknameHandler(event)}
                        />
                    </div>
                    <div className="url container">
                        <p>ここにurl</p>
                        <input
                            type="text"
                            value={urlField}
                            onChange={(
                                event: React.ChangeEvent<HTMLInputElement>
                            ) => onChangeURLHandler(event)}
                        />
                    </div>
                    <div>
                        <p>ここに概要</p>
                        <TextareaField
                            field_width={200}
                            field_height={100}
                            value={describeText}
                            onChange={onChangeDescribeHandler}
                        />
                    </div>
                    <div>
                        <p>upload button</p>
                        <button type="button" onClick={() => uploadPortfolio()}>
                            アップロード
                        </button>
                    </div>
                </div>
            )}
        </Layout>
    )
}

export const getServerSideProps = async (
    context: GetServerSidePropsContext
) => {
    const { req } = context
    const session = await getSession({ req })

    if (!session) {
        return {
            redirect: {
                destination: '/auth/login'
            }
        }
    }

    return {
        props: {}
    }
}

export default UploadPortfolio
