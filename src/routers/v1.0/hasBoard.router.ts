import Router from "koa-router"
import * as hasBoardCtrl from "../../controller/hasBoard.controller"

const router: Router = new Router()

router.post(
    "/has-board/websites/:websiteId/boards/:boardId",
    hasBoardCtrl.writeHasBoard
)
router.delete(
    "/has-board/websites/:websiteId/boards/:boardId",
    hasBoardCtrl.removeHasBoard
)
