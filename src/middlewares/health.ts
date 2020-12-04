import * as health from '@cloudnative/health-connect'

import { isConnected } from '../config/db'

const healthCheck = new health.HealthChecker()

const stub = new health.ReadinessCheck('app readiness', async () => {
    if (!isConnected()) {
        throw new Error('db disconnected')
    }
})

healthCheck.registerReadinessCheck(stub)

export const LivenessEndpoint = health.LivenessEndpoint(healthCheck)
export const ReadinessEndpoint = health.ReadinessEndpoint(healthCheck)
export const HealthEndpoint = health.HealthEndpoint(healthCheck)
