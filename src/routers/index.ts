import Router from "koa-router"
import auth from "./v1.0/auth.router"
import boards from "./v1.0/boards.router"
import hasBoard from "./v1.0/hasBoard.router"
import messages from "./v1.0/messages.router"
import users from "./v1.0/users.router"
import websites from "./v1.0/websites.router"

const router: Router = new Router()

router.use("/v1.0", auth.routes())
router.use("/v1.0", boards.routes())
router.use("/v1.0", messages.routes())
router.use("/v1.0", websites.routes())
router.use("/v1.0", hasBoard.routes())
router.use("/v1.0", users.routes())

export default router
