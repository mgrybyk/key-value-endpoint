import { dbClose, isConnected } from '../../src/config/db'

afterAll(() => {
    dbClose()
})

export const waitForDb = () =>
    new Promise((resolve) => {
        const interval = setInterval(() => {
            if (isConnected()) {
                clearInterval(interval)
                resolve(true)
            }
        }, 50)
    })
