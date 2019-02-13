import mongoose, { ConnectionOptions } from "mongoose"

const connectionOptions: ConnectionOptions = {
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500,
    poolSize: 10,
    bufferMaxEntries: 0,
    useNewUrlParser: true
}

export default (() => {
    mongoose.Promise = global.Promise

    return {
        connect() {
            return mongoose
                .connect(process.env.DB_ENDPOINT || "", connectionOptions)
                .then(() => {
                    console.log("Successed connect to DB")
                })
                .catch(error => {
                    console.error(error)
                })
        },
        disconnect() {
            return mongoose.disconnect()
        }
    }
})()
