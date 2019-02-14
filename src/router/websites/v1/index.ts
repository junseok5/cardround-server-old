import Router from "koa-router"
import adminAuthentication from "../../../middlewares/admin.authentication"
import * as websitesCtrl from "./websites.ctrl"

const websites: Router = new Router()

websites.get('/', websitesCtrl.listWebsite)
websites.get('/:id', websitesCtrl.readWebsite)
websites.post("/", adminAuthentication, websitesCtrl.writeWebsite)
websites.patch("/:id", adminAuthentication, websitesCtrl.updateWebsite)

export default websites
