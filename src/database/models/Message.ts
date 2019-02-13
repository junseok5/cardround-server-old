import { Document, Model, model, Schema } from "mongoose"

export interface IConent {
    website: string
    detail?: string
}

export interface IMessage extends Document {
    user: Schema.Types.ObjectId
    content: IConent
    createdAt: Date
}

const MessageSchema: Schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        website: {
            type: String,
            default: "",
            required: true
        },
        detail: {
            type: String,
            default: ""
        }
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

let MessageModel: Model<IMessage>

try {
    MessageModel = model<IMessage>("Message", MessageSchema)
} catch (error) {
    MessageModel = model<IMessage>("Message")
}

export default MessageModel
