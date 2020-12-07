// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

import * as Joi from 'joi'

const envVarsSchema = Joi.object()
    .keys({
        NODE_ENV: Joi.string().valid('production', 'development', 'test').default('development'),
        PORT: Joi.number().default(3000),
        MONGODB_HOST: Joi.string().default('localhost'),
        MONGODB_PORT: Joi.number().default(27017),
        MONGODB_NAME: Joi.string().default('key-value-store'),
    })
    .unknown()

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env)

if (error) {
    throw new Error(`Config validation error: ${error.message}`)
}

export default {
    env: envVars.NODE_ENV as string,
    port: envVars.PORT as number,
    dbHost: envVars.MONGODB_HOST as string,
    dbPort: envVars.MONGODB_PORT as number,
    dbName: envVars.MONGODB_NAME as string,
}
