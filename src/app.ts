import Koa from "koa"
import KoaBody from "koa-body"
import logger from "koa-logger"
import session from "koa-session"
import database from "./database/database"
import jwt from "./middlewares/jwt"
import router from "./routers"

class App {
    public app: Koa

    constructor() {
        this.app = new Koa()
        this.connectDatabase()
        this.middlewares()
        this.app.keys = [process.env.COOKIE_SIGN_KEY || ""]
    }

    public listen(port): void {
        this.app.listen(port)
        console.log(`Server listening to port ${port}`)
    }

    private connectDatabase = (): void => {
        database.connect()
    }

    private middlewares = (): void => {
        this.app.use(logger())
        this.app.use(KoaBody({ multipart: true }))
        this.app.use(session({ maxAge: 86400000 }, this.app))
        this.app.use(jwt)
        this.app.use(router.routes()).use(router.allowedMethods())
    }
}

export default App
