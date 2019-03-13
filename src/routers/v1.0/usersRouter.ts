import Router from "koa-router"
import * as usersCtrl from "../../controller/v1.0/users.controller"
import userAuthentication from "../../middlewares/user.authentication"

const router: Router = new Router()

router.get("/users/following", userAuthentication, usersCtrl.listFollowBoard)
router.get(
    "/users/following/preview",
    userAuthentication,
    usersCtrl.listPreviewFollowBoard
)
router.post(
    "/users/following/:boardId",
    userAuthentication,
    usersCtrl.followBoard
)
router.delete(
    "/users/following/:boardId",
    userAuthentication,
    usersCtrl.unfollowBoard
)
router.get("/users", userAuthentication, usersCtrl.getMyInfo)
router.get("/users/:id", usersCtrl.getUserInfo)

export default router
