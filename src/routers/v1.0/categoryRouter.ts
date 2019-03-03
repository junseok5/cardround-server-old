import Router from "koa-router"
import * as categoriesCtrl from "../../controller/v1.0/categories.controller"
import adminAuthentication from "../../middlewares/admin.authentication"

const router: Router = new Router()

router.get("/categories", categoriesCtrl.listCategory)
router.post("/categories", adminAuthentication, categoriesCtrl.writeCategory)
router.patch("/categories/:id", adminAuthentication, categoriesCtrl.updateCategory)

export default router
