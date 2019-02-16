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

const NumPerPage = 20

FollowBoardSchema.statics.findList = function(query, page) {
    return this.find(query)
        .sort({ score: "desc" })
        .limit((page - 1) * NumPerPage)
        .populate({
            path: "previewBoard",
            model: "PreviewBoard",
            select: "board name link layoutType cards"
        })
        .lean()
}

const FolloBoardwModel: any = model<IFollowBoard>("Follow", FollowBoardSchema)

export default FolloBoardwModel
