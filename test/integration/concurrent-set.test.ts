import * as WebSocket from 'ws'
import * as express from 'express'
import * as getPort from 'get-port'

import * as wss from '../../src/ws-routes/wss'
import config from '../../src/config/config'
import { waitForDb } from './db-connection'

jest.unmock('express')

describe('main', () => {
    jest.setTimeout(30000)

    const expressSpy = jest.spyOn(express.application, 'listen')
    const wsSpy = jest.spyOn(wss, 'wsServerInit')

    beforeAll(async () => {
        config.port = await getPort()
        require('../../src/index')

        await waitForDb()
    })

    it('should run server on proper port', async () => {
        const clients = 20
        const messagesPerConnection = 30

        const connections = await Promise.all(
            Array(clients)
                .fill(null)
                .map((_, idx) => spawnConnection(idx) as Promise<{ ws: WebSocket; idx: number }>)
        )
        const results = await Promise.all(
            connections.map(({ ws, idx }) => sendMessages(ws, idx, messagesPerConnection) as Promise<boolean[]>)
        )

        const combinedResults = results.flat()

        expect(combinedResults.length).toBe(clients * messagesPerConnection)
    })

    afterAll(() => {
        wsSpy.mock.results[0].value?.close()
        expressSpy.mock.results[0].value?.close()
        expressSpy.mockClear()
    })
})

/**
 * create new WebSocket connection
 * @param idx web socket connection idx for debugging
 */
const spawnConnection = (idx: number) => {
    const ws = new WebSocket(`ws://127.0.0.1:${config.port}/ws`)

    return new Promise((resolve, reject) => {
        ws.once('error', reject)

        ws.once('message', (data: string) => {
            const message = JSON.parse(data)

            if (message.msg === 'connected') {
                ws.off('error', reject)
                resolve({ ws, idx })
            }
        })

        ws.on('ping', ws.pong)
    })
}

/**
 * send N messages asyncrhously
 * @param ws WebSocket instance
 * @param idx web socket connection idx for debugging
 * @param messagesToSend amount of messages to send
 */
const sendMessages = (ws: WebSocket, idx: number, messagesToSend: number) => {
    const results: boolean[] = []

    const listener = new Promise((resolve, reject) => {
        ws.once('close', () => resolve(results))
        ws.once('error', reject)

        ws.on('message', (data: string) => {
            const message = JSON.parse(data)

            if (message.method === 'set-value') {
                // reject on failure
                if (message.success !== true) {
                    return reject(message.error)
                }

                // save success
                results.push(message.success)
            }

            // close connection once all messages received
            if (results.length === messagesToSend) {
                ws.close()
            }
        })
    })

    // send messages
    for (let i = 1; i <= messagesToSend; i++) {
        ws.send(JSON.stringify({ id: `${i}`, method: 'set-value', params: { key: 'foo', value: `bar-${idx}-${i}` } }))
    }

    return listener
}
