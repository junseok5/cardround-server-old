import Router from "koa-router"
import * as websitesCtrl from "../../controller/websites.controller"
import adminAuthentication from "../../middlewares/admin.authentication"

const router: Router = new Router()

router.get('/websites', websitesCtrl.listWebsite)
router.get('/websites/:id', websitesCtrl.readWebsite)
router.post("/websites/", adminAuthentication, websitesCtrl.writeWebsite)
router.patch("/websites/:id", adminAuthentication, websitesCtrl.updateWebsite)

export default router
