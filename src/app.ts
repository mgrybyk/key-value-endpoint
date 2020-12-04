import * as express from 'express'
import * as httpStatus from 'http-status'

import { HealthEndpoint, LivenessEndpoint, ReadinessEndpoint } from './middlewares/health'
import { routes } from './routes/v1/index'
import { ApiError } from './error'
import { errorConverter, errorHandler } from './middlewares/error'

export const app = express()

// parse json request body
app.use(express.json())

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }))

app.use('/health/liveness', LivenessEndpoint)
app.use('/health/readiness', ReadinessEndpoint)
app.use('/health', HealthEndpoint)

// v1 api routes
app.use('/v1', routes)

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'))
})

// convert error to ApiError, if needed
app.use(errorConverter)

// handle error
app.use(errorHandler)
