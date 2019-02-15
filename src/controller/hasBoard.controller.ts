import { Context } from "koa";
import { Types } from "mongoose"
import BoardModel, { IBoard } from "../database/models/Board"
import HasBoardModel, { IHasBoard } from "../database/models/HasBoard"
import WebsiteModel, { IWebsite } from "../database/models/Website";
import { RemoveHasBoardResponse, WriteHasBoardResponse } from "../types/types";

export const writeHasBoard = async (ctx: Context) => {
    let result: WriteHasBoardResponse
    const { websiteId, boardId } = ctx.params

    let website: IWebsite | null = null
    let board: IBoard | null = null

    try {
        website = await WebsiteModel.findById(websiteId).exec()
    } catch (error) {
        result = {
            ok: false,
            error: error.message
        }

        ctx.status = 500
        ctx.body = result
        return
    }

    if (website) {
        try {
            board = await BoardModel.findById(boardId).exec()
        } catch (error) {
            result = {
                ok: false,
                error: error.message
            }

            ctx.status = 500
            ctx.body = result
        }
    } else {
        result = {
            ok: false,
            error: "Website does not found."
        }

        ctx.status = 404
        ctx.body = result
        return
    }

    const websiteObjectId = Types.ObjectId(websiteId)
    const boardObjectId = Types.ObjectId(boardId)

    let hasBoard: IHasBoard

    if (board) {
        try {
            hasBoard = await HasBoardModel.findOne({
                website: websiteObjectId,
                board: boardObjectId
            })
        } catch(error) {
            result = {
                ok: false,
                error: error.message
            }

            ctx.status = 500
            ctx.body = result
            return
        }
    } else {
        result = {
            ok: false,
            error: "Board does not found."
        }

        ctx.status = 404
        ctx.body = result
        return
    }

    if (!hasBoard) {
        try {
            await new HasBoardModel({
                website: websiteObjectId,
                board: boardObjectId
            }).save()

            result = {
                ok: true,
                error: null
            }

            ctx.body = result
            return
        } catch(error) {
            result = {
                ok: false,
                error: error.message
            }

            ctx.status = 500
            ctx.body = result
            return
        }
    } else {
        result = {
            ok: false,
            error: "Website already contains board."
        }

        ctx.status = 400
        ctx.body = result
        return
    }
}

export const removeHasBoard = async (ctx: Context) => {
    let result: RemoveHasBoardResponse
    const { websiteId, boardId } = ctx.params

    const websiteObjectId = Types.ObjectId(websiteId)
    const boardObjectId = Types.ObjectId(boardId)

    let hasBoard: IHasBoard

    try {
        hasBoard = await HasBoardModel.findOne({
            website: websiteObjectId,
            board: boardObjectId
        })
    } catch(error) {
        result = {
            ok: false,
            error: error.message
        }

        ctx.status = 500
        ctx.body = result
        return
    }

    if (hasBoard) {
        try {
            await hasBoard.remove()

            result = {
                ok: true,
                error: null
            }

            ctx.body = result
        } catch(error) {
            result = {
                ok: false,
                error: error.message
            }

            ctx.status = 500
            ctx.body = result
        }
    } else {
        result = {
            ok: false,
            error: "HasBoard does not found."
        }

        ctx.status = 404
        ctx.body = result
    }
}
