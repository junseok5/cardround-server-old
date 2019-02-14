import Router from 'koa-router'
import adminAuthentication from '../../../middlewares/admin.authentication';
import * as boardsCtrl from './boards.ctrl'

const boards: Router = new Router()

boards.get("/", boardsCtrl.listBoard)
boards.get("/:id", boardsCtrl.readBoard)
boards.post("/", adminAuthentication, boardsCtrl.writeBoard)
boards.patch("/:id", adminAuthentication, boardsCtrl.updateBoard)

export default boards