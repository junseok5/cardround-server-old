import { IWebsiteDocument } from "../database/models/Website"
import { IUserDocument } from "../database/models/User"
import { IFollowBoardDocument } from "../database/models/FollowBoard"
import { IBoardDocument } from "../database/models/Board"
import { Schema } from "mongoose"
import { ICategoryDocument } from "../database/models/Category"

export interface LocalLoginResponse {
    ok: boolean
    error: error | null
    token: string | null
}

export interface SocialLoginResponse {
    ok: boolean
    error: error | null
    token: string | null
}

export interface GetUserInfoResponse {
    ok: boolean
    error: error | null
    user: IUserDocument | null
}

export interface SendMessageResponse {
    ok: boolean
    error: error | null
}

export interface UserAuthenticationResponse {
    ok: boolean
    error: error | null
}

export interface AdminLoginResponse {
    ok: boolean
    error: error | null
}

export interface AdminAuthenticationResponse {
    ok: boolean
    error: error | null
}

export interface ListWebsiteResponse {
    ok: boolean
    error: error | null
    websites: IWebsiteDocument[] | null
}

export interface ReadWebsiteResponse {
    ok: boolean
    error: error | null
    website: IWebsiteDocument | null
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

export interface FollowBoardResponse {
    ok: boolean
    error: error | null
    board: Schema.Types.ObjectId
}

export interface UnfollowBoardResponse {
    ok: boolean
    error: error | null
    board: Schema.Types.ObjectId
}

export interface ListFollowBoardResponse {
    ok: boolean
    error: error | null
    followingBoards: IFollowBoardDocument[] | null
}

export interface ListBoardResponse {
    ok: boolean
    error: error | null
    boards: IBoardDocument[] | null
}

export interface ListBoardPreview {
    ok: boolean
    error: error | null
    boards: IBoardDocument[] | null
}

export interface WriteCategoryResponse {
    ok: boolean
    error: error | null
}

export interface UpdateCategoryResponse {
    ok: boolean
    error: error | null
}

export interface ListCategoryResponse {
    ok: boolean
    error: error | null
    categories: ICategoryDocument[] | null
}

export interface ListWebsitePreview {
    ok: boolean
    error: error | null
    websites: IWebsiteDocument[] | null
}

export interface ListPreviewFollowBoard {
    ok: boolean
    error: error | null
    followingBoards: IFollowBoardDocument[] | null
}
