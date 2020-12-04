// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

import * as Joi from '@hapi/joi'

const envVarsSchema = Joi.object()
    .keys({
        NODE_ENV: Joi.string().valid('production', 'development', 'test').default('development'),
        PORT: Joi.number().default(3000),
    })
    .unknown()

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env)

if (error) {
    throw new Error(`Config validation error: ${error.message}`)
}

export default {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
}
