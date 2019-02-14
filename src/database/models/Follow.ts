import { Document, model, Schema } from "mongoose";

export interface IFollow extends Document {
    user: Schema.Types.ObjectId,
    board: Schema.Types.ObjectId,
    score: number
}

const FollowSchema: Schema = new Schema({
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

let FollowModel

try {
    FollowModel = model<IFollow>('Follow', FollowSchema)
} catch(error) {
    FollowModel = model<IFollow>('Follow')
}

export default FollowModel
