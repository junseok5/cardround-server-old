import Router from "koa-router"
import authentication from "../../../middlewares/authentication"
import * as messagesCtrl from "./messages.ctrl"

const messages: Router = new Router()

messages.post("/", authentication, messagesCtrl.sendMessage)

export default messages
