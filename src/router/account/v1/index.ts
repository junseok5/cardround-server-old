import Router from 'koa-router'
import users from './users'

const router: Router = new Router()

router.use('/users', users.routes())

export default router