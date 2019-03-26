import { Context } from "koa"
import Board, { IBoardDocument } from "../../database/models/Board"
import Category, { ICategoryDocument } from "../../database/models/Category"
import FollowingBoard, {
    IFollowingBoardDocument
} from "../../database/models/FollowingBoard"
import User, { IUserDocument } from "../../database/models/User"
import Website, { IWebsiteDocument } from "../../database/models/Website"
import { GetInitialData } from "../../types/types"

export const getInitialData = async (ctx: Context) => {
    let result: GetInitialData
    const user = ctx.user
    const page = 1

    try {
        const boardCategories: ICategoryDocument[] = await Category.findList(
            "BOARD"
        )

        const boards: IBoardDocument[] = await Board.findList(
            { private: false },
            page
        )

        const websiteCategories: ICategoryDocument[] = await Category.findList(
            "WEBSITE"
        )

        const websites: IWebsiteDocument[] = await Website.findList(
            { private: false },
            page
        )

        let followingPreviewBoards: IFollowingBoardDocument[] | null = null
        let profile: IUserDocument | null = null

        if (user) {
            followingPreviewBoards = await FollowingBoard.findPreviewList({
                user: user._id
            })
            profile = await User.getProfile(user._id)
        }

        result = {
            ok: true,
            error: null,
            followingPreviewBoards,
            boardCategories,
            boards,
            websiteCategories,
            websites,
            profile
        }

        ctx.body = result
    } catch (error) {
        result = {
            ok: false,
            error: error.message
        }

        ctx.status = 500
        ctx.body = result
    }
}
