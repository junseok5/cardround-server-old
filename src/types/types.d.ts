import { IWebsite } from "../database/models/Website";
import { IUser } from "../database/models/User";
import { IBoard } from "../database/models/Board";
import { IHasBoard } from "../database/models/HasBoard";
import { IFollowBoard } from "../database/models/FollowBoard";

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

export interface WriteBoardResponse {
    ok: boolean
    error: error | null
}

export interface UpdateBoardResponse {
    ok: boolean
    error: error | null
}

export interface WriteHasBoardResponse {
    ok: boolean
    error: error | null
}

export interface RemoveHasBoardResponse {
    ok: boolean
    error: error | null
}

export interface ListHasBoardResponse {
    ok: boolean
    error: error | null
    hasBoards: IHasBoard[] | null
}

export interface FollowBoardResponse {
    ok: boolean
    error: error | null
    followerCount: number | null
}

export interface UnfollowBoardResponse {
    ok: boolean
    error: error | null
    followerCount: number | null
}

export interface ListFollowBoardResponse {
    ok: boolean
    error: error | null
    followBoards: IFollowBoard[] | null
}
