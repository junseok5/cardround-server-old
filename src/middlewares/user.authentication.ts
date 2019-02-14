import { Context } from "koa"
import { UserAuthenticationResponse } from "../types/types"

export default (ctx: Context, next: () => Promise<any>) => {
    if (!ctx.user) {
        const result: UserAuthenticationResponse = {
            ok: false,
            error: "User authentication failed."
        }

        ctx.status = 401
        ctx.body = result
        return
    }

    return next()
}
