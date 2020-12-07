import * as WebSocket from 'ws'
import type { Server } from 'http'

import { onMessage } from './routes'
import { buildSuccessResponse } from './wsMessage'

const pingInterval = 30000

export const wsServerInit = (server: Server) => {
    const wss = new WebSocket.Server({ server, path: '/ws' })

    wss.on('connection', function (ws: WebSocket & { isAlive: boolean }) {
        ws.isAlive = true
        ws.on('pong', heartbeat)

        ws.on('message', async (data: unknown) => {
            const result = await onMessage(data)
            ws.send(JSON.stringify(result))
        })

        ws.send(JSON.stringify(buildSuccessResponse({ msg: 'connected' })))
    })

    const interval = setInterval(function ping() {
        wss.clients.forEach(function each(ws: WebSocket & { isAlive: boolean }) {
            if (ws.isAlive === false) {
                return ws.terminate()
            }

            ws.isAlive = false
            ws.ping()
        })
    }, pingInterval)

    wss.on('close', function close() {
        clearInterval(interval)
    })

    return wss
}

function heartbeat() {
    this.isAlive = true
}
