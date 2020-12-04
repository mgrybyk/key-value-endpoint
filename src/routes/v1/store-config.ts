import * as express from 'express'

export const storeRoute = express.Router()

storeRoute.get('/:key', (req, res, next) => {
    console.log(req.params.key)
    if (req.params.key === '404') {
        return next()
    }
    res.end('value')
})
