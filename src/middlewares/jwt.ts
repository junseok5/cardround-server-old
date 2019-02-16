import { Context } from "koa"
import decodeJWT from "../utils/decodeJWT"

export default async (ctx: Context, next: () => Promise<any>) => {
    const token = ctx.get('X-JWT')

    if (!token) {
        // ctx.user = 
        // Test user
        ctx.user = {
            _id: "5c681fb079c054df9a1a5b14"
        }
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
