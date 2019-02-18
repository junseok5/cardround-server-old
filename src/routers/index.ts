import Router from "koa-router"
import auth from "./v1.0/authRouter"
import boards from "./v1.0/boardsRouter"
// import hasBoard from "./v1.0/hasBoard.router"
import messages from "./v1.0/messagesRouter"
import previewBoards from "./v1.0/previewBoardRouter"
import users from "./v1.0/usersRouter"
import websites from "./v1.0/websitesRouter"

const router: Router = new Router()

router.use("/v1.0", auth.routes())
router.use("/v1.0", boards.routes())
router.use("/v1.0", previewBoards.routes())
router.use("/v1.0", messages.routes())
router.use("/v1.0", websites.routes())
// router.use("/v1.0", hasBoard.routes())
router.use("/v1.0", users.routes())

export default router
