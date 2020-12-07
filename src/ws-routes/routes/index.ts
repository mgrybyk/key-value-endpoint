import * as Joi from 'joi'

import { buildErrorResponse } from '../wsMessage'
import { store } from './store'

export const onMessage = async (data: unknown): Promise<WsResponse> => {
    const message = parseData(data) as WsMessage

    const validation = validateMessage(message)
    if (validation.error) {
        return buildErrorResponse(validation.error.message)
    }

    let result: WsResponse
    if (message.method === 'set-value') {
        result = await store(message)
    } else {
        result = buildErrorResponse('Unkown method: ' + message.method)
    }
    return result
}

const parseData = (data: unknown) => {
    if (typeof data === 'string') {
        try {
            return JSON.parse(data)
        } catch {}
    }

    return data
}

const validateMessage = (message: WsMessage) => {
    const schema = Joi.object({
        method: Joi.string().required(),
        id: Joi.string().required(),
        params: Joi.object().required(),
    })

    return schema.validate(message)
}
