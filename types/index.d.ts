import { Date, ObjectId } from "mongoose"

export type BucketFile = {
    chunkSize: number
    contentType: string
    filename: string
    length: number
    uploadDate: string
    _id: ObjectId
}

export type UploadFile = {
    fieldname: string
    originalname: string
    encoding: string
    mimetype: string
    id: ObjectId
    filename: string
    metadata: any
    bucketName: string
    chunkSize: number
    size: number
    md5: any
    uploadDate: Date
    contentType: string
}

type Portfolio = {
    _id: ObjectId
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
    createdAt: Date
    updatedAt: Date
}

type Review = {
    createdAt: string
    username: string
    star: number
    text: string
}
