import got from 'got'
import * as express from 'express'
import * as getPort from 'get-port'

import config from '../src/config/config'

describe('main', () => {
    const expressSpy = jest.spyOn(express.application, 'listen')

    beforeAll(async () => {
        config.port = await getPort()
        require('../src/index')
    })

    it('should run server on proper port', () => {
        expect(expressSpy).toBeCalledTimes(1)
        expect(expressSpy).toBeCalledWith(config.port, expect.any(Function))
    })

    it('should response to liveness health check', async () => {
        const result = await got.get(`http://localhost:${config.port}/health/liveness`, {
            responseType: 'json',
        })
        const body = result.body as { status: string }
        expect(body.status).toBe('UP')
        expect(result.statusCode).toBe(200)
    })

    afterAll(() => {
        expressSpy.mock.results[0].value?.close()
        expressSpy.mockClear()
    })
})
