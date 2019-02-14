import Router from 'koa-router'
import account from './account/account'
import auth from './auth/auth'
import messages from './messages/messages'
import websites from './websites/websites'

const router: Router = new Router()

// API definition
/*
    /auth
    /account
    /boards
    /websites
    /follow
    /messages
*/

router.use('/account', account.routes())
router.use('/auth', auth.routes())
router.use('/messages', messages.routes())
router.use('/websites', websites.routes())

export default router