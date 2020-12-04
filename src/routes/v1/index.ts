import * as express from 'express'

import { storeRoute } from './store-config'

export const routes = express.Router()

routes.use('/store', storeRoute)
