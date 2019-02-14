import Joi, { Schema } from "joi"
import { Context } from "koa"
import UserModel, { IUser } from "../../../database/models/User"
import { AdminLoginResponse, LoginResponse } from "../../../types/types"
import createJWT from "../../../utils/createJWT"
import getGoogleProfile from "../../../utils/getGoogleProfile"

export const login = async (ctx: Context) => {
    let result: LoginResponse
    const { body } = ctx.request

    const schema: Schema = Joi.object().keys({
        accessToken: Joi.string().required()
    })

    const validation = Joi.validate(body, schema)

    if (validation.error) {
        ctx.status = 400
        return
    }

    let profile

    try {
        profile = await getGoogleProfile(body.accessToken)
    } catch (error) {
        result = {
            ok: false,
            error: error.message,
            token: null
        }

        ctx.status = 401
        ctx.body = result
        return
    }

    if (!profile) {
        result = {
            ok: false,
            error: "Could not find google profile.",
            token: null
        }

        ctx.status = 401
        ctx.body = result
        return
    }

    let user: IUser | null = null

    try {
        user = await UserModel.findSocialId({ id: profile.id })
    } catch (error) {
        result = {
            ok: false,
            error: error.message,
            token: null
        }

        ctx.status = 500
        ctx.body = result
        return
    }

    if (user) {
        // 로그인
        try {
            const token = await createJWT(user._id)

            result = {
                ok: true,
                error: null,
                token
            }

            ctx.body = result
        } catch (error) {
            result = {
                ok: false,
                error: error.message,
                token: null
            }

            ctx.status = 500
            ctx.body = result
        }
    } else {
        // 회원가입
        try {
            const newUser = await new UserModel({
                email: profile.email,
                displayName: profile.name,
                thumbnail: profile.thumbnail,
                accessToken: body.accessToken,
                socialId: profile.id
            }).save()

            const token = await createJWT(newUser._id)

            result = {
                ok: true,
                error: null,
                token
            }

            ctx.body = result
        } catch (error) {
            result = {
                ok: false,
                error: error.message,
                token: null
            }

            ctx.status = 500
            ctx.body = result
        }
    }
}

export const adminLogin = async (ctx: Context) => {
    let result: AdminLoginResponse
    const { password } = ctx.request.body

    if (password === process.env.ADMIN_PASSWORD) {
        result = {
            ok: true,
            error: null
        }

        ctx.session.logged = true
        ctx.body = result
    } else {
        result = {
            ok: false,
            error: "Not match password"
        }

        ctx.status = 401
        ctx.body = result
    }
}
