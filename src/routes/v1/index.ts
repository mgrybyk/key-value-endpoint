import { Router } from 'express'

import { storeRoute } from './store'

export const routes = Router()

routes.use('/store', storeRoute)
