import Joi, { Schema } from "joi"
import { Context } from "koa"
import WebsiteModel, { IWebsite } from "../../../database/models/Website"
import {
    UpdateWebsiteResponse,
    WriteWebsiteResponse
} from "../../../types/types"

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

    const validation = Joi.validate(body, schema)

    if (validation.error) {
        result = {
            ok: false,
            error: "Validation failed."
        }

        ctx.status = 400
        ctx.body = result
        return
    }

    let website: IWebsite | null = null

    const { name, thumbnail, link, category } = body

    try {
        website = await WebsiteModel.findOne({
            $or: [{ name }, { link }]
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

    if (website) {
        result = {
            ok: false,
            error: "Website already exist."
        }

        ctx.status = 400
        ctx.body = result
    } else {
        try {
            await new WebsiteModel({
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
        } catch (error) {
            result = {
                ok: false,
                error: error.message
            }

            ctx.status = 500
            ctx.body = result
        }
    }
}

export const updateWebsite = async (ctx: Context) => {
    let result: UpdateWebsiteResponse
    const { id } = ctx.params
    const { body } = ctx.request

    let website: IWebsite | null = null

    try {
        website = await WebsiteModel.findById(id).exec()
    } catch (error) {
        result = {
            ok: false,
            error: error.message
        }

        ctx.status = 500
        ctx.body = result
    }

    if (website) {
        const allowedFields = {
            name: true,
            thumbnail: true,
            link: true,
            category: true,
            boards: true
        }

        const schema: Schema = Joi.object({
            name: Joi.string()
                .min(1)
                .max(50),
            thumbnail: Joi.string(),
            link: Joi.string(),
            category: Joi.string()
        })

        const validation = Joi.validate(body, schema)

        if (validation.error) {
            result = {
                ok: false,
                error: "Validation failed."
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
                ...website.toObject(),
                ...body
            }

            await website.update({ ...patchData })
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
            error: "Website was not found."
        }

        ctx.status = 404
        ctx.body = result
    }
}
