import Router from "koa-router"
import * as initialCtrl from "../../controller/v1.0/initial.controller"

const router: Router = new Router()

router.get("/initial", initialCtrl.getInitialData)

export default router
