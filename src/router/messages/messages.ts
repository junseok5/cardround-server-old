import Router from "koa-router"
import v1 from "./v1"

const router: Router = new Router()

router.use("/v1", v1.routes())

export default router
