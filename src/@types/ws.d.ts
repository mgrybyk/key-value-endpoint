interface WsMessage {
    id: string
    method: string
    params: Record<string, string>
}

interface WsResponse {
    id: string | undefined
    success: boolean
    method?: string
    msg?: string
    error?: string
}
