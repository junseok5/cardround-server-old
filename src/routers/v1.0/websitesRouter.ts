import Router from "koa-router"
import * as websitesCtrl from "../../controller/v1.0/websites.controller"
import adminAuthentication from "../../middlewares/admin.authentication"

const router: Router = new Router()

router.get("/websites", websitesCtrl.listWebsite)
router.get("/websites/search/preview", websitesCtrl.listPreview)
router.get("/websites/:id", websitesCtrl.readWebsite)
router.post("/websites/", adminAuthentication, websitesCtrl.writeWebsite)
router.patch("/websites/:id", adminAuthentication, websitesCtrl.updateWebsite)

export default router
