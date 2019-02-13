import Koa from 'koa'
import KoaBody from 'koa-body'
import logger from 'morgan'
import database from './database/database'

class App {
    public app: Koa

    constructor() {
        this.app = new Koa()
        this.connectDatabase()
        this.middlewares()
    }

    public listen(port):void {
        this.app.listen(port)
        console.log(`Server listening to port ${port}`)
    }

    private connectDatabase = (): void => {
        database.connect()
    }

    private middlewares = (): void => {
        this.app.use(logger('dev'))
        this.app.use(KoaBody({ multipart: true }))
    }
}

export default App