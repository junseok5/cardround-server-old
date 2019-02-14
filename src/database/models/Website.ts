import { Document, model, Schema } from "mongoose"

export interface IWebsite extends Document {
    name: string
    thumbnail?: string
    link: string
    category: string
    boards: Schema.Types.ObjectId[]
    createdAt: Date
    updatedAt: Date
}

const WebsiteSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    thumbnail: String,
    link: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        required: true,
        index: true
    },
    boards: [
        {
            type: Schema.Types.ObjectId,
            ref: "Board"
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
})

let WebsiteModel

try {
    WebsiteModel = model<IWebsite>("Website", WebsiteSchema)
} catch (error) {
    WebsiteModel = model<IWebsite>("Website")
}

export default WebsiteModel
