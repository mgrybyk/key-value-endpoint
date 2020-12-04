import * as winston from 'winston'
import config from './config'

const enumerateErrorFormat = winston.format((info) => {
    if (info instanceof Error) {
        Object.assign(info, { message: info.stack })
    }
    return info
})

export const logger = winston.createLogger({
    level: config.env === 'development' ? 'debug' : 'info',
    format: winston.format.combine(
        enumerateErrorFormat(),
        config.env === 'development' ? winston.format.colorize() : winston.format.uncolorize(),
        winston.format.splat(),
        winston.format.printf(({ level, message }) => `${level}: ${formatter(message)}`)
    ),
    transports: [
        new winston.transports.Console({
            stderrLevels: ['error'],
        }),
    ],
})

const formatter = (message: string | Array<unknown> | Record<string, unknown>) => {
    let msg = message
    if (Array.isArray(message)) {
        msg = message.reduce((acc, item) => {
            if (typeof item === 'string') {
                acc += item
            } else {
                acc += JSON.stringify(item, null, 2)
            }
            return acc + ' '
        }, '') as string
    }

    return msg
}
