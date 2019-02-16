import { Context } from "koa"
import { Schema } from "mongoose"
import BoardModel, { IBoardDocument } from "../../database/models/Board"
import FollowBoardModel, {
    IFollowBoardDocument
} from "../../database/models/FollowBoard"
import FollowWebsiteModel, {
    IFollowWebsiteDocument
} from "../../database/models/FollowWebsite"
import HasBoardModel, {
    IHasBoardDocument
} from "../../database/models/HasBoard"
import PreviewBoardModel, {
    IPreviewBoardDocument
} from "../../database/models/PreviewBoard"
import UserModel, { IUserDocument } from "../../database/models/User"
import WebsiteModel from "../../database/models/Website"
import {
    FollowBoardResponse,
    GetUserInfoResponse,
    ListFollowBoardResponse,
    UnfollowBoardResponse
} from "../../types/types"

/*
    [GET] /v1.0/users/:id/
*/
export const getUserInfo = async (ctx: Context) => {
    let result: GetUserInfoResponse
    const { id } = ctx.params

    try {
        const user: IUserDocument | null = await UserModel.findById(id, {
            socialId: false,
            accessToken: false,
            createdAt: false,
            updatedAt: false
        })

        if (user) {
            result = {
                ok: true,
                error: null,
                user
            }

            ctx.body = result
        } else {
            result = {
                ok: false,
                error: "Not found user.",
                user: null
            }

            ctx.status = 404
            ctx.body = result
        }
    } catch (error) {
        result = {
            ok: false,
            error: error.message,
            user: null
        }

        ctx.status = 500
        ctx.body = result
    }
}

/*
    [GET] /v1.0/users/following/
*/
export const listFollowBoard = async (ctx: Context) => {
    let result: ListFollowBoardResponse
    const page = parseInt(ctx.query.page || 1, 10)
    const userId: Schema.Types.ObjectId = ctx.user._id

    try {
        const following: IFollowBoardDocument[] = await FollowBoardModel.findList(
            {
                user: userId
            },
            page
        )

        result = {
            ok: true,
            error: null,
            followBoards: following
        }

        ctx.body = result
    } catch (error) {
        result = {
            ok: false,
            error: error.message,
            followBoards: null
        }

        ctx.status = 500
        ctx.body = result
        return
    }
}

/*
    [POST] /v1.0/users/following/:previewBoardId
*/
export const followBoard = async (ctx: Context) => {
    let result: FollowBoardResponse
    const { previewBoardId } = ctx.params
    const userId: string = ctx.user._id

    try {
        const following: IFollowBoardDocument | null = await FollowBoardModel.findOne(
            {
                user: userId,
                previewBoard: previewBoardId
            }
        )

        if (following) {
            result = {
                ok: true,
                error: null
            }

            ctx.body = result
            return
        }

        await new FollowBoardModel({
            user: userId,
            previewBoard: previewBoardId
        }).save()

        result = {
            ok: true,
            error: null
        }

        ctx.body = result
    } catch (error) {
        result = {
            ok: false,
            error: error.message
        }

        ctx.status = 500
        ctx.body = result
        return
    }

    // 보드 팔로우
    try {
        const followerCount: number = await FollowBoardModel.countDocuments({
            previewBoard: previewBoardId
        })

        const previewBoard: IPreviewBoardDocument | null = await PreviewBoardModel.findById(
            previewBoardId
        )

        if (previewBoard) {
            const board: IBoardDocument | null = await BoardModel.findById(
                previewBoard.board
            )

            if (board) {
                const previewBoardPatchData = {
                    ...previewBoard.toObject(),
                    follower: followerCount
                }
                const boardPatchData = {
                    ...board.toObject(),
                    follower: followerCount
                }

                await previewBoard.update({
                    ...previewBoardPatchData
                })

                await board.update({
                    ...boardPatchData
                })
            }
        }
    } catch (error) {
        throw new Error(error)
    }

    // 웹사이트 팔로우
    try {
        const hasBoard: IHasBoardDocument | null = await HasBoardModel.findOne({
            previewBoard: previewBoardId
        })

        if (hasBoard) {
            const followWebsite: IFollowWebsiteDocument | null = await FollowWebsiteModel.findOne(
                {
                    user: userId,
                    website: hasBoard.website
                }
            )

            if (!followWebsite) {
                await new FollowWebsiteModel({
                    user: userId,
                    website: hasBoard.website
                }).save()

                const followWebsiteCount: number = await FollowWebsiteModel.countDocuments(
                    {
                        website: hasBoard.website
                    }
                )

                await WebsiteModel.findByIdAndUpdate(hasBoard.website, {
                    follower: followWebsiteCount
                })
            }
        }
    } catch (error) {
        throw new Error(error)
    }
}

/*
    [DELETE] /v1.0/users/following/:previewBoardId
*/
export const unfollowBoard = async (ctx: Context) => {
    let result: UnfollowBoardResponse
    const { previewBoardId } = ctx.params
    const userId: string = ctx.user._id

    try {
        const following: IFollowBoardDocument | null = await FollowBoardModel.findOne(
            {
                user: userId,
                previewBoard: previewBoardId
            }
        )

        if (!following) {
            result = {
                ok: true,
                error: null
            }

            ctx.body = result
            return
        }

        await following.remove()

        result = {
            ok: true,
            error: null
        }

        ctx.body = result
    } catch (error) {
        result = {
            ok: false,
            error: error.message
        }

        ctx.status = 500
        ctx.body = result
        return
    }

    // 보드 팔로워 수 업데이트
    try {
        const followerCount: number = await FollowBoardModel.countDocuments({
            previewBoard: previewBoardId
        })

        const previewBoard: IPreviewBoardDocument | null = await PreviewBoardModel.findById(
            previewBoardId
        )

        if (previewBoard) {
            const board: IBoardDocument | null = await BoardModel.findById(
                previewBoard.board
            )

            if (board) {
                const previewBoardPatchData = {
                    ...previewBoard.toObject(),
                    follower: followerCount
                }
                const boardPatchData = {
                    ...board.toObject(),
                    follower: followerCount
                }

                await previewBoard.update({ ...previewBoardPatchData })
                await board.update({ ...boardPatchData })
            }
        }
    } catch (error) {
        throw new Error(error)
    }

    //  웹사이트 언팔로우 & 웹사이트 팔로워 수 업데이트
    try {
        const hasBoard: IHasBoardDocument | null = await HasBoardModel.findOne({
            previewBoard: previewBoardId
        })

        if (hasBoard) {
            const hasBoardArray: IHasBoardDocument[] = await HasBoardModel.find(
                {
                    website: hasBoard.website
                }
            )

            const followingArray: IFollowBoardDocument[] = await FollowBoardModel.find(
                {
                    user: userId
                }
            )

            if (followingArray.length > 0) {
                for (const hasBoardIndex of Object.keys(hasBoardArray)) {
                    for (const followBoardIndex of Object.keys(
                        followingArray
                    )) {
                        const websitePreviewBoard =
                            hasBoardArray[hasBoardIndex].previewBoard

                        const followingPreviewBoard =
                            followingArray[followBoardIndex].previewBoard

                        if (websitePreviewBoard.equals(followingPreviewBoard)) {
                            return
                        }
                    }
                }
            }

            await FollowWebsiteModel.deleteOne({
                user: userId,
                website: hasBoard.website
            })

            const websiteCount: number = await FollowWebsiteModel.countDocuments(
                {
                    website: hasBoard.website
                }
            )

            await WebsiteModel.findByIdAndUpdate(hasBoard.website, {
                follower: websiteCount
            })
        }
    } catch (error) {
        throw new Error(error)
    }
}
