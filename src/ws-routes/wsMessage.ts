export const buildSuccessResponse = ({ id, method, msg }: { id?: string; method?: string; msg?: string } = {}) =>
    ({
        success: true,
        msg,
        id,
        method,
    } as WsResponse)

export const buildErrorResponse = (error: string, { id = undefined, method = undefined }: { id?: string; method?: string } = {}) =>
    ({
        success: false,
        error,
        id,
        method,
    } as WsResponse)
