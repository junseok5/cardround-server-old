import Router from "koa-router"
import * as authCtrl from '../../controller/v1.0/auth.controller'

const router: Router = new Router()

router.post("/auth/login", authCtrl.login)
router.post('/auth/login/admin', authCtrl.adminLogin)

export default router