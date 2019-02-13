import Router from 'koa-router'

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

router.use('/auth', router.routes())

export default router