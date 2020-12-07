import { connect, connection } from 'mongoose'
import type { ConnectOptions, Mongoose } from 'mongoose'

import { logger } from './logger'
import config from './config'
import '../validations/mongoose'

let connected = false

const { dbHost, dbPort, dbName } = config

const mongooseOpts: ConnectOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
}

connection.once('open', () => {
    connected = true
    logger.info('Connection to mongoDb established.')
})
connection.on('reconnected', () => {
    connected = true
    logger.info('MongoDB reconnected!')
})
connection.on('disconnected', () => {
    connected = false
    logger.warn('MongoDB disconnected!')
})

let db: Mongoose
export const dbConnect = async () => {
    db = (await connect(`mongodb://${dbHost}:${dbPort}/${dbName}`, mongooseOpts).catch((e) => {
        logger.error(e)
        process.kill(process.pid, 'SIGTERM')
    })) as Mongoose
    return db
}

export const isConnected = () => connected

export const dbClose = () => {
    if (db) {
        db.disconnect()
    }
}
