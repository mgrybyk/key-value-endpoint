import { onMessage } from '../../../src/ws-routes/routes'
import StoreModel from '../../../src/components/store/store.model'

jest.mock('../../../src/components/store/store.model', () => ({
    default: {
        setKeyValue: jest.fn().mockImplementation(async (key: string) => {
            if (key === 'error') {
                throw new Error('db error')
            }
        }),
    },
}))

const StoreModelMock = (StoreModel as unknown) as { setKeyValue: jest.Mock }

const buildMessage = (key: unknown, value: unknown) => ({ id: 'id', method: 'set-value', params: { key, value } })
const buildErrorResponse = (error: string) => ({ error, success: false, id: 'id', method: 'set-value' })

describe('ws: store', () => {
    it('should successfully set value', async () => {
        const message = await onMessage(JSON.stringify(buildMessage('foo', 'bar')))
        expect(StoreModelMock.setKeyValue).toBeCalledWith('foo', 'bar')
        expect(message).toEqual({ id: 'id', method: 'set-value', success: true })
    })

    const validationScenarios = [
        {
            name: 'only string as key',
            key: 1,
            value: 'bar',
            error: '"key" must be a string',
        },
        {
            name: 'only string as value',
            key: 'foo',
            value: {},
            error: '"value" must be a string',
        },
        {
            name: 'only non empty string as key',
            key: '',
            value: 'bar',
            error: '"key" is not allowed to be empty',
        },
    ]

    validationScenarios.forEach(({ name, key, value, error }) => {
        it('should allow ' + name, async () => {
            const message = await onMessage(JSON.stringify(buildMessage(key, value)))
            expect(message).toEqual(buildErrorResponse(error))
        })
    })

    it('should not throw on db error', async () => {
        const message = await onMessage(JSON.stringify(buildMessage('error', 'bar')))
        expect(message).toEqual(buildErrorResponse('db error'))
    })

    afterEach(() => {
        StoreModelMock.setKeyValue.mockClear()
    })
})
