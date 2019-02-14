import { Context } from "koa"
import UserModel, { IUser } from "../../../../database/models/User"
import { GetUserInfoResponse } from "../../../../types/types"

export const getUserInfo = async (ctx: Context) => {
    let result: GetUserInfoResponse
    const { id } = ctx.params

    try {
        const user: IUser = await UserModel.findById(id, {
            socialId: false,
            accessToken: false,
            createdAt: false,
            updatedAt: false
        }).exec()

        if (user) {
            result = {
                ok: true,
                error: null,
                user
            }

            ctx.body = result
        } else {
            result = {
                ok: false,
                error: "Not found user.",
                user: null
            }

            ctx.status = 404
            ctx.body = result
        }
    } catch (error) {
        result = {
            ok: false,
            error: error.message,
            user: null
        }

        ctx.status = 500
        ctx.body = result
    }
}
