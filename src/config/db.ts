import { logger } from './logger'
import * as mongoose from 'mongoose'

let connected = false

const dbHost = process.env.MONGODB_HOST || 'localhost'
const dbPort = process.env.MONGODB_PORT || '37017'
const dbName = process.env.MONGODB_NAME || 'key-value-store'

const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

const db = mongoose.connection

db.once('open', () => {
    connected = true
    logger.info('Connection to mongoDb established.')
})
db.on('reconnected', () => {
    connected = true
    logger.info('MongoDB reconnected!')
})
db.on('disconnected', () => {
    connected = false
    logger.warn('MongoDB disconnected!')
})

export default db

export const dbConnect = () =>
    mongoose.connect(`mongodb://${dbHost}:${dbPort}/${dbName}`, mongooseOpts).catch((e) => {
        logger.error(e)
        process.kill(process.pid, 'SIGTERM')
    })

export const isConnected = () => connected
