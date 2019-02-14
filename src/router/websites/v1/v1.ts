import Router from "koa-router"
import adminAuthentication from "../../../middlewares/admin.authentication"
import * as websitesCtrl from "./websites.ctrl"

const websites: Router = new Router()

websites.post("/", adminAuthentication, websitesCtrl.writeWebsite)
websites.patch("/", adminAuthentication, websitesCtrl.updateWebsite)

export default websites
