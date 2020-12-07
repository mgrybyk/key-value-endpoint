import { Router } from 'express'

import { storeRoute } from '../../../src/routes/v1/store'
import StoreModel from '../../../src/components/store/store.model'

jest.mock('../../../src/components/store/store.model', () => ({
    default: {
        getValueByKey: jest.fn().mockImplementation(async (key: string) => {
            if (key === 'error') {
                throw new Error('db error')
            }
            if (key === 'null') {
                return null
            }
            return 'bar'
        }),
    },
}))

// init storeRoute
storeRoute
const getMock = (Router as jest.Mock).mock.results[0].value.get as jest.Mock
const routeFn = getMock.mock.calls[0][1]

const StoreModelMock = (StoreModel as unknown) as { getValueByKey: jest.Mock }

describe('rest: store', () => {
    const mockFn = jest.fn()

    it('should properly define route', () => {
        expect(getMock).toBeCalledWith('/:key', expect.any(Function))
    })

    it('should successfully get value', async () => {
        await routeFn({ params: { key: 'foo' } }, { end: mockFn })
        expect(mockFn).toBeCalledWith('bar')
    })

    it('should call next fn if value not found', async () => {
        await routeFn({ params: { key: 'null' } }, null, mockFn)
        expect(mockFn).toBeCalledWith()
    })

    it('should call next fn with error', async () => {
        await routeFn({ params: { key: 'error' } }, null, mockFn)
        expect(mockFn).toBeCalledWith(new Error('db error'))
    })

    afterEach(() => {
        mockFn.mockClear()
        StoreModelMock.getValueByKey.mockClear()
    })
})
