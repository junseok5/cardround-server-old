import Router from "koa-router"
import * as boardsCtrl from "../../controller/v1.0/boards.controller"

const router: Router = new Router()

router.get("/boards", boardsCtrl.listBoard)
router.get("/boards/search/preview", boardsCtrl.listPreview)
router.post("/boards", boardsCtrl.wrtieBoard)
router.patch("/boards/:id", boardsCtrl.updateBoard)

export default router
