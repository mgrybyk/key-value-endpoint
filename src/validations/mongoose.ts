import { Schema } from 'mongoose'

Schema.Types.String.checkRequired((str: unknown) => typeof str === 'string')
