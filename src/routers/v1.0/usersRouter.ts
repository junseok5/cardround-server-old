import Router from "koa-router"
import * as usersCtrl from "../../controller/v1.0/users.controller"
import userAuthentication from "../../middlewares/user.authentication"

const router: Router = new Router()

router.get("/users/following", userAuthentication, usersCtrl.listFollowBoard)
router.post(
    "/users/following/:previewBoardId",
    userAuthentication,
    usersCtrl.followBoard
)
router.delete(
    "/users/following/:previewBoardId",
    userAuthentication,
    usersCtrl.unfollowBoard
)
router.get("/users", userAuthentication, usersCtrl.getMyInfo)
router.get("/users/:id", usersCtrl.getUserInfo)

export default router
