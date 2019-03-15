import { Context } from "koa"
import { Schema } from "mongoose"
import Board, { IBoardDocument } from "../../database/models/Board"
import FollowingBoard, {
    IFollowingBoardDocument
} from "../../database/models/FollowingBoard"
import FollowingWebsite, {
    IFollowingWebsiteDocument
} from "../../database/models/FollowingWebsite"
import User, { IUserDocument } from "../../database/models/User"
import Website from "../../database/models/Website"
import {
    FollowBoardResponse,
    GetUserInfoResponse,
    ListFollowBoardResponse,
    ListPreviewFollowBoard,
    UnfollowBoardResponse,
    UpdateScore
} from "../../types/types"

/*
    [GET] /v1.0/users/
*/
export const getMyInfo = async (ctx: Context) => {
    let result: GetUserInfoResponse
    const { _id } = ctx.user

    try {
        const user: IUserDocument | null = await User.findById(_id, {
            social: false,
            password: false,
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
    [GET] /v1.0/users/:id
*/
export const getUserInfo = async (ctx: Context) => {
    let result: GetUserInfoResponse
    const { id } = ctx.params

    try {
        const user: IUserDocument | null = await User.findById(id, {
            social: false,
            password: false,
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
    [GET] /v1.0/users/following
*/
export const listFollowBoard = async (ctx: Context) => {
    let result: ListFollowBoardResponse
    const page = parseInt(ctx.query.page || 1, 10)
    const userId: Schema.Types.ObjectId = ctx.user._id

    try {
        const following: IFollowingBoardDocument[] = await FollowingBoard.findList(
            {
                user: userId
            },
            page
        )

        result = {
            ok: true,
            error: null,
            followingBoards: following
        }

        ctx.body = result
    } catch (error) {
        result = {
            ok: false,
            error: error.message,
            followingBoards: null
        }

        ctx.status = 500
        ctx.body = result
        return
    }
}

/*
    [GET] /v1.0/users/following/preview
*/
export const listPreviewFollowBoard = async (ctx: Context) => {
    let result: ListPreviewFollowBoard
    const userId: Schema.Types.ObjectId = ctx.user._id

    try {
        const following: IFollowingBoardDocument[] = await FollowingBoard.findPreviewList(
            { user: userId }
        )

        result = {
            ok: true,
            error: null,
            followingBoards: following
        }

        ctx.body = result
    } catch (error) {
        result = {
            ok: false,
            error: error.message,
            followingBoards: null
        }

        ctx.status = 500
        ctx.body = result
        return
    }
}

/*
    [POST] /v1.0/users/following/:boardId
*/
export const followBoard = async (ctx: Context) => {
    let result: FollowBoardResponse
    const { boardId } = ctx.params
    const userId: string = ctx.user._id

    try {
        const following: IFollowingBoardDocument | null = await FollowingBoard.findOne(
            {
                user: userId,
                board: boardId
            }
        )

        if (following) {
            result = {
                ok: true,
                error: null,
                board: boardId
            }

            ctx.body = result
            return
        }

        await new FollowingBoard({
            user: userId,
            board: boardId
        }).save()

        result = {
            ok: true,
            error: null,
            board: boardId
        }

        ctx.body = result
    } catch (error) {
        result = {
            ok: false,
            error: error.message,
            board: boardId
        }

        ctx.status = 500
        ctx.body = result
        return
    }

    try {
        const followerCount: number = await FollowingBoard.countDocuments({
            board: boardId
        })

        const board: IBoardDocument | null = await Board.findById(boardId)

        if (board) {
            const patchData = {
                ...board.toObject(),
                follower: followerCount
            }

            await board.update({
                ...patchData
            })

            // 웹사이트 팔로우 & 웹사이트 팔로우 수 업데이트
            const { websiteId } = board
            const followWebsite: IFollowingWebsiteDocument | null = await FollowingWebsite.findOne(
                {
                    user: userId,
                    website: websiteId
                }
            )

            if (!followWebsite) {
                await new FollowingWebsite({
                    user: userId,
                    website: websiteId
                }).save()

                const followWebsiteCount: number = await FollowingWebsite.countDocuments(
                    {
                        website: websiteId
                    }
                )

                await Website.findByIdAndUpdate(websiteId, {
                    follower: followWebsiteCount
                })
            }
        }
    } catch (error) {
        throw new Error(error)
    }
}

/*
    [DELETE] /v1.0/users/following/:boardId
*/
export const unfollowBoard = async (ctx: Context) => {
    let result: UnfollowBoardResponse
    const { boardId } = ctx.params
    const userId: string = ctx.user._id

    try {
        const following: IFollowingBoardDocument | null = await FollowingBoard.findOne(
            {
                user: userId,
                board: boardId
            }
        )

        if (!following) {
            result = {
                ok: true,
                error: null,
                board: boardId
            }

            ctx.body = result
            return
        }

        await following.remove()

        result = {
            ok: true,
            error: null,
            board: boardId
        }

        ctx.body = result
    } catch (error) {
        result = {
            ok: false,
            error: error.message,
            board: boardId
        }

        ctx.status = 500
        ctx.body = result
        return
    }

    try {
        const followerCount: number = await FollowingBoard.countDocuments({
            board: boardId
        })

        const board: IBoardDocument | null = await Board.findById(boardId)

        if (board) {
            // 보드 팔로워 수 업데이트
            const patchData = {
                ...board.toObject(),
                follower: followerCount
            }

            await board.update({ ...patchData })

            //  웹사이트 언팔로우 & 웹사이트 팔로워 수 업데이트
            const { websiteId } = board

            const allOfBoardsInWebsite: IBoardDocument[] = await Board.find({
                websiteId
            })

            const followingBoards: IFollowingBoardDocument[] = await FollowingBoard.find(
                {
                    user: userId
                }
            )

            if (followingBoards.length > 0) {
                for (const boardKey of Object.keys(allOfBoardsInWebsite)) {
                    for (const fbKey of Object.keys(followingBoards)) {
                        const boardIdOfWeb = allOfBoardsInWebsite[boardKey]._id
                        const boardIdOfFB = followingBoards[fbKey].previewBoard

                        if (boardIdOfWeb.equals(boardIdOfFB)) {
                            return
                        }
                    }
                }
            }

            await FollowingWebsite.deleteOne({
                user: userId,
                website: websiteId
            })

            const websiteCount: number = await FollowingWebsite.countDocuments({
                website: websiteId
            })

            await Website.findByIdAndUpdate(websiteId, {
                follower: websiteCount
            })
        }
    } catch (error) {
        throw new Error(error)
    }
}

/*
    [PATCH] /v1.0/users/following/:boardId/score
*/
export const updateFollowingBoardScore = async (ctx: Context) => {
    let result: UpdateScore
    const { boardId } = ctx.params
    const userId: string = ctx.user._id

    try {
        const followingBoard: IFollowingBoardDocument | null = await FollowingBoard.findOne(
            { board: boardId, user: userId }
        )

        if (followingBoard) {
            followingBoard.score++
            followingBoard.save()
        }

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
    }
}
