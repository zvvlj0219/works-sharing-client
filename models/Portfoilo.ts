import mongoose, { models, ObjectId, Date } from 'mongoose'
import type { Review } from '../types'

interface PortfolioDoc extends mongoose.Document {
    _id: ObjectId;
    image: {
        name: string;
    };
    username: string;
    review: Review[];
    work_url: string;
    work_name: string;
    description: string;
    review_avg: number;
    like: number;
    dislike: number
    createdAt: Date
    updatedAt: Date
}

interface PortfolioModel extends mongoose.Model<PortfolioDoc> {}

const portfoiloSchema = new mongoose.Schema(
    {
        image: {
            name: {
                type: String,
                require: true
            }
        },
        username: {
            type: String,
            require: true
        },
        review: {
            type: Array,
            ref: 'Review'
        },
        work_url: {
            type: String,
            require: true
        },
        work_name: {
            type: String,
            require: true
        },
        description: {
            type: String,
            require: true
        },
        review_avg: {
            type: Number,
        },
        like: {
            type: Number,
        },
        dislike: {
            type: Number,
        },
    },
    {
        timestamps: true
    },
)

const schema = models.Portfolio
    ? (models.Portfolio as PortfolioModel)
    : mongoose.model<PortfolioDoc, PortfolioModel>('Portfolio', portfoiloSchema)

export default schema