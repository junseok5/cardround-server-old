export interface UserInfo {
    email: string
    displayName: string
    thumbnail: string
}

export interface LoginResponse {
    ok: boolean
    error: string | null
    token: string | null
}

export interface GetUserInfoResponse {
    ok: boolean
    error: string | null
    user: UserInfo | null
}

export interface SendMessageResponse {
    ok: boolean
    error: string | null
}

export interface UserAuthenticationResponse {
    ok: boolean
    error: string | null
}

export interface AdminLoginResponse {
    ok: boolean
    error: string | null
}

export interface AdminAuthenticationResponse {
    ok: boolean
    error: string | null
}

export interface WriteWebsiteResponse {
    ok: boolean
    error: string | null
}
