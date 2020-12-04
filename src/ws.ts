import * as WebSocket from 'ws'
import type { Server } from 'http'

const pingInterval = 30000

export const wsServerInit = (server: Server) => {
    const wss = new WebSocket.Server({ server })

    wss.on('connection', function (ws: WebSocket & { isAlive: boolean }) {
        ws.isAlive = true
        ws.on('pong', heartbeat)

        ws.on('message', (message: string) => {
            console.log('received: %s', message)
            ws.send(`Hello, you sent -> ${message}`)
        })

        ws.on('close', () => {
            console.log('colse ws')
        })

        ws.send('Hi there')
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
