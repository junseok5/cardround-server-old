import Joi, { Schema } from "joi"
import { Context } from "koa"
import MessageModel from "../../../database/models/Message"
import { SendMessageResponse } from "../../../types/types"

export const sendMessage = async (ctx: Context) => {
    let result: SendMessageResponse
    const { body } = ctx.request
    const { user } = ctx

    const schema: Schema = Joi.object().keys({
        content: Joi.string()
            .min(1)
            .max(300)
            .required()
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

    try {
        await new MessageModel({
            user: user._id,
            content: body.content
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
