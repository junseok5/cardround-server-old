import { Document, model, Model, Schema } from "mongoose"

export interface IFollowBoardDocument extends Document {
    _id: Schema.Types.ObjectId
    user: Schema.Types.ObjectId
    board: Schema.Types.ObjectId
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

FollowBoardSchema.statics.findList = function(query, page) {
    return this.find(query, {
        user: false
    })
        .sort({ score: "desc" })
        .limit(NumPerPage)
        .skip((page - 1) * NumPerPage)
        .populate({
            path: "board",
            model: "Board",
            select: "name link layoutType cards websiteThumbnail websiteName"
        })
        .lean()
}

export default model<IFollowBoardDocument, IFollowBoardModel>(
    "FollowBoard",
    FollowBoardSchema
)
