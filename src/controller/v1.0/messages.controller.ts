import Joi, { Schema, ValidationResult } from "joi"
import { Context } from "koa"
import MessageModel, { IMessageDocument } from "../../database/models/Message"
import { SendMessageResponse } from "../../types/types"

/*
    [POST] /v1.0/messages/
*/
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

    const validation: ValidationResult<any> = Joi.validate(body, schema)

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
        const newMessage: IMessageDocument | null = await new MessageModel({
            user: user._id,
            content: body.content
        }).save()

        if (newMessage) {
            result = {
                ok: true,
                error: null
            }

            ctx.body = result
        } else {
            result = {
                ok: false,
                error: "Send message failed. Message does not found."
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
    }
}
