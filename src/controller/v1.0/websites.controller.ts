import Joi, { Schema, ValidationResult } from "joi"
import { Context } from "koa"
import Board from "../../database/models/Board"
import PreviewBoard, {
    IPreviewBoardDocument
} from "../../database/models/PreviewBoard"
import Website, { IWebsiteDocument } from "../../database/models/Website"
import {
    ListWebsiteResponse,
    ReadWebsiteResponse,
    UpdateWebsiteResponse,
    WriteWebsiteResponse
} from "../../types/types"

/*
    [GET] /v1.0/websites/
*/
export const listWebsite = async (ctx: Context) => {
    let result: ListWebsiteResponse
    const page = parseInt(ctx.query.page || 1, 10)
    const category: string = ctx.query.category
    const keyword: string = ctx.query.keyword

    let query = {}
    const baseQuery = { private: false }

    query = category ? { ...baseQuery, category } : { ...baseQuery }
    query = keyword
        ? {
              ...query,
              name: { $regex: keyword, $options: "i" }
          }
        : { ...query }

    if (page < 1) {
        result = {
            ok: false,
            error: "Page must have more than 1.",
            websites: null
        }

        ctx.status = 400
        ctx.body = result
        return
    }

    try {
        const websites: IWebsiteDocument[] = await Website.findList(query, page)

        result = {
            ok: true,
            error: null,
            websites
        }

        ctx.body = result
    } catch (error) {
        result = {
            ok: false,
            error: error.message,
            websites: null
        }

        ctx.status = 500
        ctx.body = result
    }
}

/*
    [GET] /v1.0/websites/:id
*/
export const readWebsite = async (ctx: Context) => {
    let result: ReadWebsiteResponse
    const { id } = ctx.params

    try {
        const website: IWebsiteDocument | null = await Website.findById(id, {
            createdAt: false,
            updatedAt: false,
            category: false
        })

        if (website) {
            result = {
                ok: true,
                error: null,
                website
            }

            ctx.body = result
        } else {
            result = {
                ok: false,
                error: "Website does not found.",
                website: null
            }

            ctx.status = 404
            ctx.body = result
        }
    } catch (error) {
        result = {
            ok: false,
            error: error.message,
            website: null
        }

        ctx.status = 500
        ctx.body = result
    }
}

/*
    [POST] /v1.0/websites/
*/
export const writeWebsite = async (ctx: Context) => {
    let result: WriteWebsiteResponse
    const { body } = ctx.request

    const schema: Schema = Joi.object().keys({
        name: Joi.string()
            .min(1)
            .max(50)
            .required(),
        thumbnail: Joi.string(),
        link: Joi.string().required(),
        category: Joi.string().required()
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

    const { name, thumbnail, link, category } = body

    try {
        const website: IWebsiteDocument | null = await Website.findOne({
            $or: [{ name }, { link }]
        })

        if (website) {
            result = {
                ok: false,
                error: "Website already exist."
            }

            ctx.status = 400
            ctx.body = result
        } else {
            await new Website({
                name,
                thumbnail,
                link,
                category
            }).save()

            result = {
                ok: true,
                error: null
            }

            ctx.body = result
        }
    } catch (error) {
        result = {
            ok: false,
            error: error.message
        }

        ctx.status = 500
        ctx.body = result
        return
    }
}

/*
    [PATCH] /v1.0/websites/:id
*/
export const updateWebsite = async (ctx: Context) => {
    let result: UpdateWebsiteResponse
    const { id } = ctx.params
    const { body } = ctx.request

    try {
        const website: IWebsiteDocument | null = await Website.findById(id)

        if (website) {
            const allowedFields = {
                name: true,
                thumbnail: true,
                link: true,
                category: true,
                private: true
            }

            const schema: Schema = Joi.object({
                name: Joi.string()
                    .min(1)
                    .max(50),
                thumbnail: Joi.string(),
                link: Joi.string(),
                category: Joi.string(),
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

            const patchData = {
                ...website.toObject(),
                ...body,
                updatedAt: Date.now()
            }

            await website.update({ ...patchData, updatedAt: Date.now() })

            const { name, thumbnail } = body

            if (name || thumbnail) {
                const previewBoard: IPreviewBoardDocument[] = await PreviewBoard.find(
                    { websiteId: id }
                )

                if (previewBoard.length > 0) {
                    for (const key of Object.keys(previewBoard)) {
                        const { _id: previewBoardId } = previewBoard[key]
                        const updatedPreviewBoard: IPreviewBoardDocument | null = await PreviewBoard.findByIdAndUpdate(
                            previewBoardId,
                            {
                                websiteName: name,
                                websiteThumbnail: thumbnail
                            }
                        )

                        if (updatedPreviewBoard) {
                            const { board: boardId } = updatedPreviewBoard

                            await Board.findByIdAndUpdate(boardId, {
                                websiteName: name,
                                websiteThumbnail: thumbnail
                            })
                        }
                    }
                }
            }

            result = {
                ok: true,
                error: null
            }

            ctx.body = result
        } else {
            result = {
                ok: false,
                error: "Website does not found."
            }

            ctx.status = 404
            ctx.body = result
        }
    } catch (error) {
        result = {
            ok: false,
            error: error.message
        }

        ctx.status = 500
        ctx.body = result
        return
    }
}
