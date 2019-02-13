import { Context } from "koa"
import { IUser } from "../database/models/User"
import decodeJWT from "../utils/decodeJWT"

export default async (ctx: Context, next: () => Promise<any>) => {
    const token = ctx.cookies.get("access_token")

    if (!token) {
        ctx.user = null
        return next()
    }

    try {
        const user: IUser | null = await decodeJWT(token)

        ctx.user = user
    } catch (error) {
        ctx.user = null
    }

    return next()
}
