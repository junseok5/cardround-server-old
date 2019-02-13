import Router from 'koa-router'
import auth from './auth'

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

router.use('/auth', auth.routes())

export default router