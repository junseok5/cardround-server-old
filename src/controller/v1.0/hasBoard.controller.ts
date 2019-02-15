import Joi, { Schema, ValidationResult } from "joi"
import { Context } from "koa"
import { Types } from "mongoose"
import HasBoardModel, { IHasBoard } from "../../database/models/HasBoard"
import PreviewBoardModel, {
    IPreviewBoard
} from "../../database/models/PreviewBoard"
import WebsiteModel, { IWebsite } from "../../database/models/Website"
import {
    ListHasBoardResponse,
    RemoveHasBoardResponse,
    WriteHasBoardResponse
} from "../../types/types"

export const listHasBoard = async (ctx: Context) => {
    let result: ListHasBoardResponse
    const page = parseInt(ctx.query.page || 1, 10)
    const { websiteId } = ctx.params

    const websiteObjectId = Types.ObjectId(websiteId)
    const query = {
        website: websiteObjectId
    }

    try {
        const hasBoards: IHasBoard[] = await HasBoardModel.findList(
            query,
            page
        )

        result = {
            ok: true,
            error: null,
            hasBoards
        }

        ctx.body = hasBoards
    } catch (error) {
        result = {
            ok: false,
            error: error.message,
            hasBoards: null
        }

        ctx.status = 500
        ctx.body = result
    }
}

export const writeHasBoard = async (ctx: Context) => {
    let result: WriteHasBoardResponse
    const { body } = ctx.request

    const schema: Schema = Joi.object({
        websiteId: Joi.string().required(),
        previewBoardId: Joi.string().required()
    })

    const validation: ValidationResult<any> = Joi.validate(body, schema)

    if (validation.error) {
        result = {
            ok: false,
            error: validation.error
        }

        ctx.status = 400
        ctx.body = result
        return
    }

    const { websiteId, previewBoardId } = body

    let website: IWebsite | null = null
    let previewBoard: IPreviewBoard | null = null

    try {
        website = await WebsiteModel.findById(websiteId)
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
            previewBoard = await PreviewBoardModel.findById(previewBoardId)
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

        ctx.body = result
        ctx.status = 404
        return
    }

    let hasBoard: IHasBoard | null

    if (previewBoard) {
        try {
            hasBoard = await HasBoardModel.findOne({
                website: websiteId,
                previewBoard: previewBoardId
            })
        } catch (error) {
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
                website: websiteId,
                previewBoard: previewBoardId
            }).save()

            result = {
                ok: true,
                error: null
            }

            ctx.body = result
            return
        } catch (error) {
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
    const { websiteId, previewBoardId } = ctx.request.body

    let hasBoard: IHasBoard | null

    try {
        hasBoard = await HasBoardModel.findOne({
            website: websiteId,
            previewBoard: previewBoardId
        })
    } catch (error) {
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
            error: "HasBoard does not found."
        }

        ctx.status = 404
        ctx.body = result
    }
}
