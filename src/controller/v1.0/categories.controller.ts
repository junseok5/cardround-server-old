import Joi, { Context, Schema, ValidationResult } from "joi"
import Category, { ICategoryDocument } from "../../database/models/Category"
import {
    ListCategoryResponse,
    UpdateCategoryResponse,
    WriteCategoryResponse
} from "../../types/types"

export const listCategory = async (ctx: Context) => {
    let result: ListCategoryResponse
    const type: string = ctx.query.type

    try {
        const categories: ICategoryDocument[] = await Category.findList(type)

        result = {
            ok: true,
            error: null,
            categories
        }

        ctx.body = result
    } catch (error) {
        result = {
            ok: false,
            error: error.message,
            categories: null
        }

        ctx.status = 500
        ctx.body = result
    }
}

export const writeCategory = async (ctx: Context) => {
    let result: WriteCategoryResponse
    const { body } = ctx.request

    const schema: Schema = Joi.object().keys({
        type: Joi.string()
            .regex(/^BOARD|WEBSITE$/)
            .required(),
        name: Joi.string()
            .min(1)
            .max(10)
            .required(),
        score: Joi.number()
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

    const { type, name, score } = body

    try {
        const category: ICategoryDocument | null = await Category.findOne({
            type,
            name
        })

        if (category) {
            result = {
                ok: false,
                error: "Category already existed."
            }

            ctx.status = 400
            ctx.body = result
        } else {
            await new Category({
                type,
                name,
                score
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
    }
}

export const updateCategory = async (ctx: Context) => {
    let result: UpdateCategoryResponse
    const { id } = ctx.params
    const { body } = ctx.request

    try {
        const category: ICategoryDocument | null = await Category.findById(id)

        if (category) {
            const schema: Schema = Joi.object().keys({
                type: Joi.string().regex(/^BOARD|WEBSITE$/),
                name: Joi.string()
                    .min(1)
                    .max(10),
                score: Joi.number()
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

            const patchData = {
                ...category.toObject(),
                ...body
            }

            await category.update({ ...patchData })

            result = {
                ok: true,
                error: null
            }

            ctx.body = result
        } else {
            result = {
                ok: false,
                error: "Category does not exist."
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
