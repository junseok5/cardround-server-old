import Router from "koa-router"
import * as authCtrl from '../../controller/auth.controller'

const router: Router = new Router()

router.post("/auth/login", authCtrl.login)
router.post('/auth/admin', authCtrl.adminLogin)

export default router