import { Document, model, Model, Schema } from "mongoose"

export interface IFollowingBoardDocument extends Document {
    _id: Schema.Types.ObjectId
    user: Schema.Types.ObjectId
    board: Schema.Types.ObjectId
    score: number
}

export interface IFollowingBoardModel extends Model<IFollowingBoardDocument> {
    findList: (
        query: { user: Schema.Types.ObjectId },
        page: number
    ) => IFollowingBoardDocument[]
    findPreviewList: (query: {
        user: Schema.Types.ObjectId
    }) => IFollowingBoardDocument[]
}

const FollowingBoardSchema: Schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    board: {
        type: Schema.Types.ObjectId,
        ref: "Board",
        required: true
    },
    score: {
        type: Number,
        default: 0
    }
})

const NumPerPage = 20

FollowingBoardSchema.statics.findList = function(query, page) {
    return this.find(query, {
        user: false
    })
        .sort({ score: "desc" })
        .limit(NumPerPage)
        .skip((page - 1) * NumPerPage)
        .populate({
            path: "board",
            model: "Board",
            select: "name link layoutType cards websiteThumbnail"
        })
        .lean()
}

FollowingBoardSchema.statics.findPreviewList = function(query) {
    return this.find(query, {
        board: true
    }).lean()
}

export default model<IFollowingBoardDocument, IFollowingBoardModel>(
    "FollowingBoard",
    FollowingBoardSchema
)
