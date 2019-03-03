import Joi, { Schema, ValidationResult } from "joi"
import { Context } from "koa"
import User, { IUserDocument } from "../../database/models/User"
import {
    AdminLoginResponse,
    LocalLoginResponse,
    SocialLoginResponse
} from "../../types/types"
import createJWT from "../../utils/createJWT"
import getSocialProfile from "../../utils/getSocialProfile"

/*
    [POST] /v1.0/auth/login/local
*/
export const localLogin = async (ctx: Context) => {
    let result: LocalLoginResponse
    const { body } = ctx.request

    const schema: Schema = Joi.object().keys({
        email: Joi.string()
            .email()
            .required(),
        password: Joi.string()
            .min(6)
            .max(30)
            .required()
    })

    const validation: ValidationResult<any> = Joi.validate(body, schema)

    if (validation.error) {
        result = {
            ok: false,
            error: validation.error,
            token: null
        }

        ctx.status = 400
        ctx.body = result
        return
    }

    const { email, password } = body
    const displayName = email.split("@")[0]

    try {
        const exists: IUserDocument | null = await User.findOne({ email })

        if (exists) {
            // 로그인
            const validatePassword: boolean = exists.validatePassword(password)

            if (!validatePassword) {
                result = {
                    ok: false,
                    error: "WRONG_PASSWORD",
                    token: null
                }

                ctx.status = 401
                ctx.body = result
                return
            }

            const accessToken = await createJWT(exists._id)

            result = {
                ok: true,
                error: null,
                token: accessToken
            }

            ctx.body = result
        } else {
            // 회원가입
            const newUser: IUserDocument = await User.localRegister({
                email,
                password,
                displayName
            })

            const accessToken = await createJWT(newUser._id)

            result = {
                ok: true,
                error: null,
                token: accessToken
            }

            ctx.body = result
        }
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

/*
    [POST] /v1.0/auth/login/:provider(facebook)
*/
export const socialLogin = async (ctx: Context) => {
    let result: SocialLoginResponse
    const { body } = ctx.request
    const provider: string = ctx.params.provider

    const schema: Schema = Joi.object().keys({
        accessToken: Joi.string().required()
    })

    const validation: ValidationResult<any> = Joi.validate(body, schema)

    if (validation.error) {
        result = {
            ok: false,
            error: validation.error,
            token: null
        }

        ctx.status = 400
        ctx.body = result
        return
    }

    const { accessToken } = body

    let profile

    try {
        profile = await getSocialProfile(provider, accessToken)
    } catch (error) {
        console.error(error)
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
            error: "Could not find social profile.",
            token: null
        }

        ctx.status = 401
        ctx.body = result
        return
    }

    let user: IUserDocument | null = null

    try {
        const profileId: string = profile.id
        user = await User.findProfileId({ provider, profileId })
    } catch (error) {
        console.error(error)
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
            return
        } catch (error) {
            console.error(error)
            result = {
                ok: false,
                error: error.message,
                token: null
            }

            ctx.status = 500
            ctx.body = result
            return
        }
    }

    if (profile.email) {
        // 회원가입
        let duplicated: IUserDocument | null

        try {
            duplicated = await User.findOne({ email: profile.email })
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

        if (duplicated) {
            duplicated.social[provider] = {
                id: profile.id,
                accessToken
            }
            duplicated.thumbnail = profile.thumbnail

            try {
                await duplicated.save()

                const token = await createJWT(duplicated._id)

                result = {
                    ok: true,
                    error: null,
                    token
                }

                ctx.body = result
                return
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
        }

        try {
            const newUser: IUserDocument | null = await User.socialRegister({
                email: profile.email,
                displayName: profile.name,
                thumbnail: profile.thumbnail,
                provider,
                accessToken,
                profileId: profile.id
            })

            if (newUser) {
                const token = await createJWT(newUser._id)

                result = {
                    ok: true,
                    error: null,
                    token
                }

                ctx.body = result
            } else {
                result = {
                    ok: false,
                    error: "Register failed. User does not found.",
                    token: null
                }

                ctx.status = 404
                ctx.body = result
            }
        } catch (error) {
            console.error(error)
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

/*
    [POST] /v1.0/auth/login/admin
*/
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
