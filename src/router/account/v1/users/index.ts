import Router from 'koa-router'
import * as usersCtrl from './users.ctrl'

const users: Router = new Router()

users.get('/:id', usersCtrl.getUserInfo)

export default users