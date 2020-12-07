import { Router } from 'express'

import StoreModel from '../../components/store/store.model'

export const storeRoute = Router()

storeRoute.get('/:key', async (req, res, next) => {
    let value: string

    try {
        value = await StoreModel.getValueByKey(req.params.key)
    } catch (err) {
        return next(err)
    }

    if (value === null) {
        return next()
    }

    res.end(value)
})
