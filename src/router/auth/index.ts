import Router from 'koa-router'

const router: Router = new Router()

router.use('/v1.0', router.routes())

export default router