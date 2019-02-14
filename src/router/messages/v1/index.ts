import Router from "koa-router"
// import userAuthentication from "../../../middlewares/user.authentication"
import * as messagesCtrl from "./messages.ctrl"

const messages: Router = new Router()

messages.post("/", messagesCtrl.sendMessage)

export default messages
