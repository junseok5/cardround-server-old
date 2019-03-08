import { IWebsite, IWebsiteDocument } from "../database/models/Website"
import { IUser } from "../database/models/User"
import { IBoard } from "../database/models/Board"
import { IHasBoard } from "../database/models/HasBoard"
import { IFollowBoard } from "../database/models/FollowBoard"
import { IPreviewBoardDocument } from "../database/models/PreviewBoard"
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
    user: IUser | null
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

export interface FollowBoardResponse {
    ok: boolean
    error: error | null
}

export interface UnfollowBoardResponse {
    ok: boolean
    error: error | null
}

export interface ListFollowBoardResponse {
    ok: boolean
    error: error | null
    followBoards: IFollowBoard[] | null
}

export interface ListPBOfWebResponse {
    ok: boolean
    error: error | null
    previewboards: IPreviewBoardDocument[] | null
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

export interface ListPreviewboardPreview {
    ok: boolean
    error: error | null
    previewboards: IPreviewBoardDocument[] | null
}
