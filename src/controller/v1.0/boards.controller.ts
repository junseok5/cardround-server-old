import Joi, { Schema, ValidationResult } from "joi"
import { Context } from "koa"
import Board, { IBoardDocument } from "../../database/models/Board"
import Website, { IWebsiteDocument } from "../../database/models/Website"
import {
    ListBoardPreview,
    ListBoardResponse,
    UpdateBoardResponse,
    WriteBoardResponse
} from "../../types/types"

/*
    [GET] /v1.0/boards
*/
export const listBoard = async (ctx: Context) => {
    let result: ListBoardResponse
    const page = parseInt(ctx.query.page || 1, 10)
    const keyword: string = ctx.query.keyword
    const category: string = ctx.query.category
    const websiteId: string = ctx.query.websiteId

    let query = {}
    const baseQuery = { private: false }

    query = websiteId
        ? { ...baseQuery, websiteId }
        : keyword
        ? {
              ...baseQuery,
              name: {
                  $regex: keyword,
                  $options: "i"
              }
          }
        : category
        ? {
              ...baseQuery,
              category
          }
        : { ...baseQuery }

    if (page < 1) {
        result = {
            ok: false,
            error: "Page must have more than 1",
            boards: null
        }

        ctx.status = 400
        ctx.body = result
        return
    }

    try {
        const boards: IBoardDocument[] = await Board.findList(query, page)

        result = {
            ok: true,
            error: null,
            boards
        }

        ctx.body = result
    } catch (error) {
        result = {
            ok: false,
            error: error.message,
            boards: null
        }

        ctx.status = 500
        ctx.body = result
    }
}

/*
    [GET] /v1.0/boards/search/preview
*/
export const listPreview = async (ctx: Context) => {
    let result: ListBoardPreview
    const keyword: string = ctx.query.keyword

    const query = { private: false, name: { $regex: keyword, $options: "i" } }

    try {
        const boards: IBoardDocument[] = await Board.findSearchPreviewList(
            query
        )

        result = {
            ok: true,
            error: null,
            boards
        }

        ctx.body = result
    } catch (error) {
        result = {
            ok: false,
            error: error.message,
            boards: null
        }

        ctx.status = 500
        ctx.body = result
    }
}

/*
    [POST] /v1.0/boards
*/
export const wrtieBoard = async (ctx: Context) => {
    let result: WriteBoardResponse
    const { body } = ctx.request

    const schema: Schema = Joi.object().keys({
        name: Joi.string()
            .min(1)
            .max(50)
            .required(),
        link: Joi.string().required(),
        category: Joi.string().required(),
        layoutType: Joi.string()
            .regex(/^NEWS_PHOTO|SHOP_PHOTO|MOVIE_CHART|MUSIC_CHART|OLD_BOARD$/)
            .required(),
        websiteId: Joi.string().required()
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

    const { name, link, category, layoutType, websiteId } = body

    try {
        const website: IWebsiteDocument | null = await Website.findById(
            websiteId
        )

        if (website) {
            await new Board({
                name,
                link,
                category,
                layoutType,
                websiteId,
                websiteName: website.name,
                websiteThumbnail: website.thumbnail
            }).save()

            result = {
                ok: true,
                error: null
            }

            ctx.body = result
        } else {
            result = {
                ok: false,
                error: "Website matched websiteId does not found."
            }

            ctx.status = 404
            ctx.body = result
            return
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

    let board: IBoardDocument | null = null

    try {
        board = await Board.findById(id)
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
            error: "Previewboard does not found."
        }

        ctx.status = 404
        ctx.body = result
        return
    }

    const allowedFields = {
        name: true,
        link: true,
        category: true,
        layoutType: true,
        websiteId: true,
        score: true,
        private: true
    }

    const schema: Schema = Joi.object().keys({
        name: Joi.string()
            .min(1)
            .max(50),
        link: Joi.string(),
        category: Joi.string(),
        layoutType: Joi.string().regex(
            /^NEWS_PHOTO|SHOP_PHOTO|MOVIE_CHART|MUSIC_CHART|OLD_BOARD$/
        ),
        websiteId: Joi.string(),
        score: Joi.number().min(0),
        private: Joi.boolean()
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
        const { websiteId } = body

        if (websiteId) {
            const website: IWebsiteDocument | null = await Website.findById(
                websiteId
            )

            if (website) {
                body.websiteName = website.name
                body.websiteThumbnail = website.thumbnail
            } else {
                result = {
                    ok: false,
                    error: "Website matched websiteId does not found."
                }

                ctx.status = 404
                ctx.body = result
                return
            }
        }

        const patchData = {
            ...board.toObject(),
            ...body,
            updatedAt: Date.now()
        }

        await board.update({ ...patchData })

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
