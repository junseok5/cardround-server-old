export interface LoginResponse {
    ok: boolean
    error: string | null
    token: string | null
}

export interface AuthCheckResponse {
    ok: boolean
    error: string | null

}
