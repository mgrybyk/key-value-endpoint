import { onMessage } from '../../../src/ws-routes/routes'

const buildMessage = ({ method, params, id }: { method?: string; id?: string; params?: Record<string, unknown> }) => ({
    id,
    method,
    params,
})
const buildErrorResponse = (error: string) => ({ error, success: false })

describe('ws: routes', () => {
    it('method should be required', async () => {
        const message = await onMessage(JSON.stringify(buildMessage({ id: 'id', params: {} })))
        expect(message).toEqual(buildErrorResponse('"method" is required'))
    })

    it('params should be required', async () => {
        const message = await onMessage(JSON.stringify(buildMessage({ id: 'id', method: 'some method' })))
        expect(message).toEqual(buildErrorResponse('"params" is required'))
    })

    it('id should be required', async () => {
        const message = await onMessage(JSON.stringify(buildMessage({ method: 'some method', params: {} })))
        expect(message).toEqual(buildErrorResponse('"id" is required'))
    })

    it('data should be a valid JSON', async () => {
        // @ts-ignore
        const message = await onMessage(null)
        expect(message).toEqual(buildErrorResponse('"value" must be of type object'))
    })

    it('data should be a valid JSON string', async () => {
        const message = await onMessage('foobar')
        expect(message).toEqual(buildErrorResponse('"value" must be of type object'))
    })

    it('should accept only allowed methods', async () => {
        const message = await onMessage(JSON.stringify(buildMessage({ id: 'id', method: 'some method', params: {} })))
        expect(message).toEqual(buildErrorResponse('Unkown method: some method'))
    })
})
