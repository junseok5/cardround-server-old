import dotenv from 'dotenv'
dotenv.config()

import App from './app'

const PORT: number | string = process.env.PORT || 4000

const app: App = new App()

app.listen(PORT)