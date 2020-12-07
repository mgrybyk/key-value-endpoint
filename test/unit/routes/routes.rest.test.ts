import { routes } from '../../../src/routes/v1'
import { storeRoute } from '../../../src/routes/v1/store'

describe('rest: routes', () => {
    it('should properly define routes', () => {
        expect(routes.use).toBeCalledWith('/store', storeRoute)
    })
})
