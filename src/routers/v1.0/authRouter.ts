import Router from "koa-router"
import * as authCtrl from "../../controller/v1.0/auth.controller"

const router: Router = new Router()

router.post("/auth/login/local", authCtrl.localLogin)
router.post("/auth/login/:provider(facebook)", authCtrl.socialLogin)
router.post("/auth/login/admin", authCtrl.adminLogin)

export default router
