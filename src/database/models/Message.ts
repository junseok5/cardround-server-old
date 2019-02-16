import { Document, model, Schema } from "mongoose"

export interface IMessageDocument extends Document {
    _id: Schema.Types.ObjectId
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

export default model<IMessageDocument>("Message", MessageSchema)
