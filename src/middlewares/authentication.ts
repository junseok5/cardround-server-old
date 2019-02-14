import { Context } from "koa"
import { AuthenticationResponse } from "../types/types"

export default (ctx: Context, next) => {
    if (ctx.user) {
        const result: AuthenticationResponse = {
            ok: false,
            error: "Authentication failed."
        }

        ctx.status = 401
        ctx.body = result
    }
}
