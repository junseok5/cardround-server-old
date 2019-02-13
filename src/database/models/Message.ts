import { Document, model, Schema } from "mongoose"

export interface IMessage extends Document {
    user: Schema.Types.ObjectId
    content: string
    createdAt: Date
}

const MessageSchema: Schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: String,
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

let MessageModel

try {
    MessageModel = model<IMessage>("Message", MessageSchema)
} catch (error) {
    MessageModel = model<IMessage>("Message")
}

export default MessageModel
