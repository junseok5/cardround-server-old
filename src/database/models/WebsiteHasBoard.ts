import { Document, model, Schema } from "mongoose"

export interface IWebsiteHasBoard extends Document {
    website: Schema.Types.ObjectId
    board: Schema.Types.ObjectId
}

const WebsiteHasBoardSchema: Schema = new Schema({
    website: {
        type: Schema.Types.ObjectId,
        ref: "Website"
    },
    board: {
        type: Schema.Types.ObjectId,
        ref: "Board"
    }
})

let WebsiteHasBoardModel

try {
    WebsiteHasBoardModel = model<IWebsiteHasBoard>(
        "WebsiteHasBoard",
        WebsiteHasBoardSchema
    )
} catch (error) {
    WebsiteHasBoardModel = model<IWebsiteHasBoard>("WebsiteHasBoard")
}

export default WebsiteHasBoardModel
