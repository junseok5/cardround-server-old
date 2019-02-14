import { Context } from "koa";
import { AdminAuthenticationResponse } from "../types/types";

export default (ctx: Context, next: () => Promise<any>) => {
    if (!ctx.session.logged) {
        const result: AdminAuthenticationResponse = {
            ok: false,
            error: "Admin authentication failed."
        }

        ctx.status = 401
        ctx.body= result
        return
    }

    return next()
}