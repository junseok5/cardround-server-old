import Joi, { Schema, ValidationResult } from "joi"
import { Context } from "koa"
import BoardModel, { IBoardDocument } from "../../database/models/Board"
import PreviewBoardModel, { IPreviewBoardDocument } from "../../database/models/PreviewBoard"
import {
    ReadBoardResponse,
    UpdateBoardResponse,
    WriteBoardResponse
} from "../../types/types"

/*
    [GET] /v1.0/boards/
*/
export const listBoard = async (ctx: Context) => {
    // 사용자 많아지면 도입
}

/*
    [GET] /v1.0/boards/:id
*/
export const readBoard = async (ctx: Context) => {
    let result: ReadBoardResponse
    const { id } = ctx.params

    try {
        const board: IBoardDocument | null = await BoardModel.findById(id, {
            createdAt: false,
            updatedAt: false
        })

        if (board) {
            result = {
                ok: true,
                error: null,
                board
            }

            ctx.body = result
        } else {
            result = {
                ok: false,
                error: "Board does not found.",
                board: null
            }

            ctx.status = 404
            ctx.body = result
        }
    } catch (error) {
        result = {
            ok: false,
            error: error.message,
            board: null
        }

        ctx.status = 500
        ctx.body = result
    }
}

/*
    [POST] /v1.0/boards/
*/
export const writeBoard = async (ctx: Context) => {
    let result: WriteBoardResponse
    const { body } = ctx.request

    const schema: Schema = Joi.object().keys({
        name: Joi.string()
            .min(1)
            .max(50)
            .required(),
        link: Joi.string().required(),
        layoutType: Joi.string()
            .regex(
                /^PHOTO_NORMAL|CHART|TEXT_VERTICAL_2|TEXT_VERTICAL_3|TEXT_NORMAL$/
            )
            .required()
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

    const { name, link, layoutType } = body

    try {
        const board: IBoardDocument | null = await new BoardModel({
            name,
            link,
            layoutType
        }).save()

        if (board) {
            await new PreviewBoardModel({
                board: board._id,
                name,
                link,
                layoutType
            }).save()
    
            result = {
                ok: true,
                error: null
            }
    
            ctx.body = result
        } else {
            result = {
                ok: false,
                error: "Write board failed. Board does not found."
            }
        }
    } catch (error) {
        result = {
            ok: false,
            error: error.message
        }

        ctx.status = 500
        ctx.body = result
    }
}

/*
    [PATCH] /v1.0/boards/:id
*/
export const updateBoard = async (ctx: Context) => {
    let result: UpdateBoardResponse
    const { id } = ctx.params
    const { body } = ctx.request

    let previewBoard: IPreviewBoardDocument | null = null
    let board: IBoardDocument | null = null

    try {
        previewBoard = await PreviewBoardModel.findById(id)
    } catch (error) {
        result = {
            ok: false,
            error: error.message
        }

        ctx.status = 500
        ctx.body = result
        return
    }

    if (!previewBoard) {
        result = {
            ok: false,
            error: "PreviewBoard does not found."
        }

        ctx.status = 404
        ctx.body = result
        return
    }

    try {
        board = await BoardModel.findById(previewBoard.board)
    } catch (error) {
        result = {
            ok: false,
            error: error.message
        }

        ctx.status = 500
        ctx.body = result
        return
    }

    if (!board) {
        result = {
            ok: false,
            error: "Board does not found."
        }

        ctx.status = 404
        ctx.body = result
        return
    }

    const allowedFields = {
        name: true,
        link: true,
        layoutType: true
    }

    const schema: Schema = Joi.object({
        name: Joi.string()
            .min(1)
            .max(50),
        link: Joi.string(),
        layoutType: Joi.string().regex(
            /^PHOTO_NORMAL|CHART|TEXT_VERTICAL_2|TEXT_VERTICAL_3|TEXT_NORMAL$/
        )
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

    for (const field in body) {
        if (!allowedFields[field]) {
            result = {
                ok: false,
                error: `${field} is not allowed field.`
            }

            ctx.status = 400
            ctx.body = result
            return
        }
    }

    try {
        const boardPatchData = {
            ...board.toObject(),
            ...body,
            updatedAt: Date.now()
        }

        const previewBoardPatchData = {
            ...previewBoard.toObject(),
            ...body,
            updatedAt: Date.now()
        }

        await board.update({ ...boardPatchData })
        await previewBoard.update({ ...previewBoardPatchData })

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
