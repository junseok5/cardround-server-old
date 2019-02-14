import { IWebsite } from "../database/models/Website";
import { IUser } from "../database/models/User";
import { IBoard } from "../database/models/Board";

export interface LoginResponse {
    ok: boolean
    error: string | null
    token: string | null
}

export interface GetUserInfoResponse {
    ok: boolean
    error: string | null
    user: IUser | null
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

export interface ListWebsiteResponse {
    ok: boolean
    error: error | null
    websites: IWebsite[] | null
}

export interface ReadWebsiteResponse {
    ok: boolean
    error: error | null
    website: IWebsite | null
}

export interface WriteWebsiteResponse {
    ok: boolean
    error: error | null
}

export interface UpdateWebsiteResponse {
    ok: boolean
    error: error | null
}

export interface ReadBoardResponse {
    ok: boolean
    error: error | null
    board: IBoard | null
}
