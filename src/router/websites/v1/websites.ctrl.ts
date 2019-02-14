import Joi, { Schema } from "joi"
import { Context } from "koa"
import WebsiteModel, { IWebsite } from "../../../database/models/Website"
import { WriteWebsiteResponse } from "../../../types/types"

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
        category: Joi.array()
            .items(Joi.string())
            .required()
    })

    const validation = Joi.validate(body, schema)

    if (validation.error) {
        result = {
            ok: false,
            error: "Validation failed"
        }

        ctx.status = 400
        ctx.body = result
        return
    }

    let website: IWebsite | null = null

    const {
        name,
        thumbnail,
        link,
        category
    } = body

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
        } catch(error) {
            result = {
                ok: false,
                error: error.message
            }

            ctx.status = 500
            ctx.body = result
        }
    }
}
