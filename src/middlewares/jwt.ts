import { Context } from "koa"
import decodeJWT from "../utils/decodeJWT"

export default async (ctx: Context, next: () => Promise<any>) => {
    const token = ctx.get('X-JWT')

    if (!token) {
        ctx.user = null
        return next()
    }

    try {
        const user = await decodeJWT(token)

        ctx.user = user
    } catch (error) {
        ctx.user = null
    }

    return next()
}
