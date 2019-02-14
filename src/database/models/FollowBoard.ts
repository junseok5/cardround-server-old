import { Document, model, Schema } from "mongoose";

export interface IFollowBoard extends Document {
    user: Schema.Types.ObjectId,
    board: Schema.Types.ObjectId,
    score: number
}

const FollowBoardSchema: Schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    board: {
        type: Schema.Types.ObjectId,
        ref: 'Board',
        required: true
    },
    score: {
        type: Number,
        default: 0
    }
})

let FolloBoardwModel

try {
    FolloBoardwModel = model<IFollowBoard>('Follow', FollowBoardSchema)
} catch(error) {
    FolloBoardwModel = model<IFollowBoard>('Follow')
}

export default FolloBoardwModel
