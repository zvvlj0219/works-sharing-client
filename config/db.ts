import mongoose from 'mongoose'

/*
* mongodb コネクションステータス
* ConnectionStates {
*     disconnected: 0,
*     connected: 1,
*     connecting: 2,
*     disconnecting: 3,
*     uninitialized: 99,
* }
*/

interface Connection {
    isConnected: number
}

type LEAN_DOCUMENT<T> = mongoose.LeanDocument<T & mongoose.Document & Required<{
    _id: mongoose.Schema.Types.ObjectId
    createdAt: mongoose.Schema.Types.Date
    updatedAt: mongoose.Schema.Types.Date
}>>

class DB {
    private connection: Connection

    constructor() {
        this.connection = {
            isConnected: 0
        }
    }

    readyStateLogger() {
        console.log(`current readyState = ${this.connection.isConnected}`)
    }

    async connect() {
        if (!process.env.MONGODB_URI) return console.log('url is wrong')

        if (this.connection.isConnected) {
            console.log('mongodb was already connected')
            return
        }

        if (mongoose.connections.length > 0) {
            this.connection.isConnected = mongoose.connections[0].readyState

            if (this.connection.isConnected === 1) {
                console.log('use previous connection')
                return
            }

            await mongoose.disconnect()
            console.log('previous mongoose connection was disconnected')
            this.readyStateLogger()
        }

        const db = await mongoose.connect(process.env.MONGODB_URI)
        this.connection.isConnected = db.connections[0].readyState
        console.log('mongoose connect done successfully')
        this.readyStateLogger()
    }

    async disconnect() {
        if (
            this.connection.isConnected &&
            process.env.NODE_ENV === 'production'
        ) {
            await mongoose.disconnect()
            this.connection.isConnected = 0
            console.log('mongoose disconnected')
        } else {
            console.log('not disconnected (env = development)')
            this.readyStateLogger()
        }
    }

    convertDocToObj = <T>(
        leanDocument: LEAN_DOCUMENT<T>
    ) => {
        const _id = leanDocument._id.toString() as string
        const createdAt = leanDocument.createdAt.toString()
        const updatedAt = leanDocument.updatedAt.toString()

        return {
            ...leanDocument,
            _id,
            createdAt,
            updatedAt
        }
    }
}

export default new DB()
