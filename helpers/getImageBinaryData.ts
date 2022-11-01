import { ObjectId } from 'mongoose'
import fetch from 'node-fetch'
import { baseUrl } from '../config'

/*
 * 画像をデータベースから取得
 * @params {string} filename - image filename
 * @params {ObjectId | string} _id - portfolio id
 */
export const getImageBinaryData = async (
    filename: string,
    _id: ObjectId | string
) => {
    const res = await fetch(`${baseUrl}/home/fetch/${filename}`)

    return {
        _id,
        image_preview_url: res.url
    }
}
