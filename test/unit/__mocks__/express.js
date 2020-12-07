// jest.mock('express', () => ({
//     Router: jest.fn().mockImplementation(() => ({
//         get: jest.fn(),
//         use: jest.fn(),
//     })),
// }))

module.exports = {
    Router: jest.fn().mockImplementation(() => ({
        get: jest.fn(),
        use: jest.fn(),
    })),
}
