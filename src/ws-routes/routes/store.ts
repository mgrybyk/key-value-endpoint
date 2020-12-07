import * as Joi from 'joi'

import StoreModel from '../../components/store/store.model'
import { buildErrorResponse, buildSuccessResponse } from '../wsMessage'

export const store = async (data: WsMessage): Promise<WsResponse> => {
    const validation = validateParams(data.params)
    if (validation.error) {
        return buildErrorResponse(validation.error.message, data)
    }

    try {
        await StoreModel.setKeyValue(data.params.key, data.params.value)
        return buildSuccessResponse(data)
    } catch (err) {
        return buildErrorResponse(err.message, data)
    }
}

const validateParams = (params: Record<string, string>) => {
    const schema = Joi.object({
        key: Joi.string().required().min(1),
        value: Joi.string().required(),
    })

    return schema.validate(params)
}
