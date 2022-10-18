import { ObjectId } from 'mongoose'
import fetch from 'node-fetch'
import { baseUrl } from '../config'

export const getImageBinaryData = async (
    filename: string,
    _id: ObjectId
) => {
    const res = await fetch(`${baseUrl}/home/fetch/${filename}`)

    return {
        id: _id,
        url: res.url
    }
}