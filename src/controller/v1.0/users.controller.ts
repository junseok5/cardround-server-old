import { Context } from "koa"
import BoardModel from "../../database/models/Board"
import FollowBoardModel, {
    IFollowBoard
} from "../../database/models/FollowBoard"
import FollowWebsiteModel from "../../database/models/FollowWebsite"
import HasBoardModel from "../../database/models/HasBoard"
import PreviewBoardModel from "../../database/models/PreviewBoard"
import UserModel, { IUser } from "../../database/models/User"
import WebsiteModel from "../../database/models/Website"
import {
    FollowBoardResponse,
    GetUserInfoResponse,
    UnfollowBoardResponse
} from "../../types/types"

export const getUserInfo = async (ctx: Context) => {
    let result: GetUserInfoResponse
    const { id } = ctx.params

    try {
        const user: IUser | null = await UserModel.findById(id, {
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

export const followBoard = async (ctx: Context) => {
    let result: FollowBoardResponse
    const { previewBoardId } = ctx.params
    const userId: string = ctx.user._id

    let following: IFollowBoard | null

    try {
        following = await FollowBoardModel.findOne({
            user: userId,
            previewBoard: previewBoardId
        })
    } catch (error) {
        result = {
            ok: false,
            error: error.message,
            followerCount: null
        }

        ctx.status = 500
        ctx.body = result
        return
    }

    if (following) {
        result = {
            ok: true,
            error: null,
            followerCount: null
        }

        ctx.body = result
        return
    }

    await new FollowBoardModel({
        user: userId,
        previewBoard: previewBoardId
    }).save()

    const followerCount: number = await FollowBoardModel.countDocuments({
        previewBoard: previewBoardId
    })

    result = {
        ok: true,
        error: null,
        followerCount
    }

    ctx.body = result

    const previewBoard = await PreviewBoardModel.findById(previewBoardId)

    if (previewBoard) {
        const board = await BoardModel.findById(previewBoard.board)

        if (board) {
            previewBoard.updateOne({ ...previewBoard, follower: followerCount })
            board.updateOne({ ...board, follower: followerCount })
        }
    }

    /*
        HasBoard에서 previewBoard를 가진 웹사이트를 찾는다.
        찾은 웹사이트와 해당 유저를 가진 FollowWebsite를 찾는다.
        FollowWebsite가 없다면 새로 추가
        있다면 그대로 둔다.
    */

    const hasBoard = await HasBoardModel.findOne({
        previewBoard: previewBoardId
    })

    if (hasBoard) {
        const followWebsite = await FollowWebsiteModel.findOne({
            user: userId,
            website: hasBoard.website
        })

        if (!followWebsite) {
            await new FollowWebsiteModel({
                user: userId,
                website: hasBoard.website
            }).save()
        }
    }
}

export const unfollowBoard = async (ctx: Context) => {
    let result: UnfollowBoardResponse
    const { previewBoardId } = ctx.params
    const userId: string = ctx.user._id

    let following: IFollowBoard | null

    try {
        following = await FollowBoardModel.findOne({
            user: userId,
            previewBoard: previewBoardId
        })
    } catch (error) {
        result = {
            ok: false,
            error: error.message,
            followerCount: null
        }

        ctx.status = 500
        ctx.body = result
        return
    }

    if (!following) {
        result = {
            ok: true,
            error: null,
            followerCount: null
        }

        ctx.body = result
        return
    }

    await following.remove()

    const followerCount: number = await FollowBoardModel.countDocuments({
        previewBoard: previewBoardId
    })

    result = {
        ok: true,
        error: null,
        followerCount
    }

    ctx.body = result

    /*
        여기부터는 유저에게 직접적으로 영향을 끼치는 요소들이 없다.
        팔로워 수 업데이트 관련 로직들만 모여있다.
        팔로워 수 업데이트에 오류가 나더라도 매번 오류가 나는게 아닌 이상
        유저가 앱을 사용하는 경험에 영향을 끼치지 못한다.
    */

    const previewBoard = await PreviewBoardModel.findById(previewBoardId)

    if (previewBoard) {
        const board = await BoardModel.findById(previewBoard.board)

        if (board) {
            previewBoard.updateOne({ ...previewBoard, follower: followerCount })
            board.updateOne({ ...board, follower: followerCount })
        }
    }

    /*
        현재 프리뷰보드의 웹사이트를 찾는다.
        찾은 웹사이트에 속해 있는 프리뷰 보드를 HasBoard에서 모두 검색
        해당 유저의 FollowBoard를 모두 검색

        FollowBoard의 보드들과 웹사이트의 프리뷰보드들을 모두 비교하며
        하나라도 같은 프리뷰보드가 발견될 시 리턴
        아무것도 발견되지 않을 시 웹사이트의 팔로워 수를 1 내린다.
    */

    const hasBoard = await HasBoardModel.findOne({
        previewBoard: previewBoardId
    })

    if (hasBoard) {
        const hasBoardArray = await HasBoardModel.find({
            website: hasBoard.website
        })

        if (hasBoardArray.length > 0) {
            const followingArray = FollowBoardModel.find({ user: userId })

            if (followingArray.length > 0) {
                hasBoardArray.forEach(hasBoardItem => {
                    followingArray.forEach(followBoardItem => {
                        if (
                            hasBoardItem.previewBoard ===
                            followBoardItem.previewBoard
                        ) {
                            return
                        }
                    })
                })
            }
        }
    }

    const websiteCount = await FollowWebsiteModel.countDocuments({
        website: hasBoard.website
    })

    await WebsiteModel.findByIdAndUpdate(hasBoard.website, {
        follower: websiteCount
    })
}
