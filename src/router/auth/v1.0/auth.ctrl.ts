import Joi, { Schema } from 'joi'
import { Context } from "koa";
import UserModel, { IUser } from '../../../database/models/User';
import { LoginResponse } from '../../../types/types';
import createJWT from '../../../utils/createJWT';
import getGoogleProfile from '../../../utils/getGoogleProfile';

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
    } catch(error) {
        result = {
            ok: false,
            error: error.message,
            token: null
        }

        ctx.status = 401
        ctx.body = result
    }

    if (!profile) {
        result = {
            ok: false,
            error: "Cannot find google profile.",
            token: null
        }

        ctx.status = 401
        ctx.body = result
    }

    let user: IUser | null = null

    try {
        user = await UserModel.findSocialId({ id: profile.id })
    } catch(error) {
        result = {
            ok: false,
            error: error.message,
            token: null
        }

        ctx.status = 500
        ctx.body = result
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
            user = await new UserModel({
                email: profile.email,
                displayName: profile.name,
                thumbnail: profile.thumbnail,
                accessToken: body.accessToken,
                socialId: profile.id
            }).save()

            if (user) {
                const token = await createJWT(user._id)

                result = {
                    ok: true,
                    error: null,
                    token
                }
                
                ctx.body = result
            } else {
                result = {
                    ok: false,
                    error: "User register failed.",
                    token: null
                }

                ctx.status = 500
                ctx.body = result
            }
        } catch(error) {
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