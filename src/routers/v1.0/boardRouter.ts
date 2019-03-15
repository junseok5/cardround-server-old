import Router from "koa-router"
import * as boardsCtrl from "../../controller/v1.0/boards.controller"
import adminAuthentication from "../../middlewares/admin.authentication"

const router: Router = new Router()

router.get("/boards", boardsCtrl.listBoard)
router.get("/boards/search/preview", boardsCtrl.listPreview)
router.post("/boards", adminAuthentication, boardsCtrl.wrtieBoard)
router.patch("/boards/:id", adminAuthentication, boardsCtrl.updateBoard)
router.patch("/boards/:id/score", boardsCtrl.updateBoardScore)

export default router
