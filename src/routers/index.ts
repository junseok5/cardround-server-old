import Router from "koa-router"
import auth from "./v1.0/authRouter"
import boards from "./v1.0/boardRouter"
import categories from './v1.0/categoryRouter'
import messages from "./v1.0/messagesRouter"
import users from "./v1.0/usersRouter"
import websites from "./v1.0/websitesRouter"

const router: Router = new Router()

router.use("/v1.0", auth.routes())
router.use("/v1.0", boards.routes())
router.use("/v1.0", messages.routes())
router.use("/v1.0", websites.routes())
router.use("/v1.0", users.routes())
router.use("/v1.0", categories.routes())

export default router
