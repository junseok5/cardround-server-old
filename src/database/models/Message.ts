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

const MessageModel: any = model<IMessage>("Message", MessageSchema)

export default MessageModel
