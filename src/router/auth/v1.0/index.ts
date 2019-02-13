import Router from 'koa-router'
import * as authCtrl from './auth.ctrl'

const auth: Router = new Router()

auth.post('/login', authCtrl.login)

// logout x (클라이언트 단에서 AsyncStorage의 토큰 삭제)
// check x (의미없음)

export default auth