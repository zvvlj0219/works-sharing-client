import Layout from '@components/Layout'
import type { GetServerSidePropsContext } from 'next'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import type { Portfolio, UploadFile } from '../../../types'
import { getSession } from 'next-auth/react'
import ProfileScreen from '@components/porfile/ProfileScreen'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useEffect, useRef, useState, useCallback } from 'react'
import TextareaField from '@components/textarea/TextareaField'
import { baseUrl } from '@config/config'
import styles from '@styles/upload.module.scss'

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

        if (!session?.user?.name) throw new Error('not found user')
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

        if (result) Router.push(`/profile/${session.user.name}/user`)
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
            {session && (
                <div className={styles.section_upload_portfolio}>
                    {session.user?.name && (
                        <ProfileScreen
                            username={session.user.name}
                            use_image_url={
                                session.user?.image ?? '/images/otaku_girl.png'
                            }
                            path={currentPath}
                        />
                    )}
                    <div className={styles.form_root}>
                        <div className={styles.upload_image_form_container}>
                            <form
                                className="select_image"
                                encType="multipart/form-data"
                            >
                                <div className="preview_image_container">
                                    <div className={styles.preview_image_core}>
                                        {previewSrc ? (
                                            <Image
                                                src={String(previewSrc.url)}
                                                alt={String(previewSrc.url)}
                                                width={200}
                                                height={200}
                                            />
                                        ) : (
                                            <PhotoCameraIcon
                                                sx={{
                                                    fontSize: 100,
                                                    display: 'block',
                                                    color: 'lightgray'
                                                }}
                                            />
                                        )}
                                    </div>
                                </div>
                                <label htmlFor="upload-image-id">
                                    <p>画像を選択してください</p>
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
                            </form>
                        </div>
                        <div className={styles.input_form_wrapper}>
                            <div className={styles.workname_container}>
                                <label htmlFor="workname_text_id">
                                    ポートフォリオ名:
                                </label>
                                <input
                                    type="text"
                                    id="workname_text_id"
                                    value={worknameField}
                                    onChange={(
                                        event: React.ChangeEvent<HTMLInputElement>
                                    ) => onChangeworknameHandler(event)}
                                />
                            </div>
                            <div className={styles.work_url_container}>
                                <label htmlFor="workurl_text_id">
                                    ポートフォリオURL:
                                </label>
                                <input
                                    type="text"
                                    id="workurl_text_id"
                                    value={urlField}
                                    onChange={(
                                        event: React.ChangeEvent<HTMLInputElement>
                                    ) => onChangeURLHandler(event)}
                                />
                            </div>
                            <div className={styles.description_container}>
                                <label htmlFor="description_text_id">
                                    概要説明:
                                </label>
                                <TextareaField
                                    id="description_text_id"
                                    value={describeText}
                                    onChange={onChangeDescribeHandler}
                                    className={styles.textarea_field_style}
                                />
                            </div>
                        </div>
                        <div className={styles.uploadbutton_container}>
                            <button
                                type="button"
                                onClick={() => uploadPortfolio()}
                            >
                                アップロード
                            </button>
                        </div>
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
