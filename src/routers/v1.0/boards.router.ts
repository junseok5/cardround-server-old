import Router from 'koa-router'
import * as boardsCtrl from '../../controller/boards.controller'
import adminAuthentication from '../../middlewares/admin.authentication';

const router: Router = new Router()

router.get("/boards", boardsCtrl.listBoard)
router.get("/boards/:id", boardsCtrl.readBoard)
router.post("/boards/", adminAuthentication, boardsCtrl.writeBoard)
router.patch("/boards/:id", adminAuthentication, boardsCtrl.updateBoard)

export default router
