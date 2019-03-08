import Router from "koa-router"
import * as previewBoardCtrl from "../../controller/v1.0/previewBoards.controller"

const router: Router = new Router()

router.get("/previewboards", previewBoardCtrl.listPreviewBoard)
router.get("/previewboards/search/preview", previewBoardCtrl.listPreview)

export default router
