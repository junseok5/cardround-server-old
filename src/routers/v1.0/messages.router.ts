import Router from 'koa-router'
import * as messagesCtrl from '../../controller/messages.controller'
import userAuthentication from '../../middlewares/user.authentication';

const router: Router = new Router()

router.post("/messages", userAuthentication, messagesCtrl.sendMessage)

export default router
