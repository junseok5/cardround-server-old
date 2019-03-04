import { Document, model, Model, Schema } from "mongoose"

export interface IFollowBoardDocument extends Document {
    _id: Schema.Types.ObjectId
    user: Schema.Types.ObjectId
    previewBoard: Schema.Types.ObjectId
    score: number
}

export interface IFollowBoardModel extends Model<IFollowBoardDocument> {
    findList: (
        query: { user: Schema.Types.ObjectId },
        page: number
    ) => IFollowBoardDocument[]
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
        .limit(NumPerPage)
        .skip((page - 1) * NumPerPage)
        .populate({
            path: "previewBoard",
            model: "PreviewBoard",
            select: "board name link layoutType cards"
        })
        .lean()
}

export default model<IFollowBoardDocument, IFollowBoardModel>(
    "FollowBoard",
    FollowBoardSchema
)
