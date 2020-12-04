import { app } from './app'
import { wsServerInit } from './ws'
import { dbConnect } from './config/db'
import config from './config/config'
import { logger } from './config/logger'

logger.info(`Running in '${config.env}' mode`)

const server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`)
})

const wss = wsServerInit(server)

dbConnect()

const unexpectedErrorHandler = (error: Error) => {
    logger.error(error)
}

process.on('uncaughtException', unexpectedErrorHandler)
process.on('unhandledRejection', unexpectedErrorHandler)

process.on('SIGTERM', () => {
    logger.info('SIGTERM received')
    if (server) {
        server.close()
        wss.close()
    }
})
