import { Document, model, Schema } from "mongoose"

export interface IFollowBoard extends Document {
    user: Schema.Types.ObjectId
    previewBoard: Schema.Types.ObjectId
    score: number
}

const FollowBoardSchema: Schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    previewBoard: {
        type: Schema.Types.ObjectId,
        ref: "PreviewBoard",
        required: true
    },
    score: {
        type: Number,
        default: 0
    }
})

const FolloBoardwModel: any = model<IFollowBoard>("Follow", FollowBoardSchema)

export default FolloBoardwModel
