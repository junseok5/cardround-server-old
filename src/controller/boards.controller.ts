import Joi, { Schema, ValidationResult } from "joi"
import { Context } from "koa"
import BoardModel, { IBoard } from "../database/models/Board"
import {
    ReadBoardResponse,
    UpdateBoardResponse,
    WriteBoardResponse
} from "../types/types"

export const listBoard = async (ctx: Context) => {
    // 사용자 많아지면 도입
}

export const readBoard = async (ctx: Context) => {
    let result: ReadBoardResponse
    const { id } = ctx.params

    try {
        const board: IBoard = await BoardModel.findById(id, {
            createdAt: false,
            updatedAt: false
        }).exec()

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

    const validation = Joi.validate(body, schema)

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
        await new BoardModel({
            name,
            link,
            layoutType
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
    }
}

export const updateBoard = async (ctx: Context) => {
    let result: UpdateBoardResponse
    const { id } = ctx.params
    const { body } = ctx.request

    let board: any = null

    try {
        board = await BoardModel.findById(id).exec()
    } catch (error) {
        result = {
            ok: false,
            error: error.message
        }

        ctx.status = 500
        ctx.body = result
        return
    }

    if (board) {
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
            const patchData = {
                ...board.toObject(),
                ...body,
                updatedAt: Date.now()
            }

            await board.updateOne({ ...patchData })

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
            error: "Board does not found."
        }

        ctx.status = 404
        ctx.body = result
    }
}
