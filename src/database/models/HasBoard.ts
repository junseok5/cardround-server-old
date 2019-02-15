import { Document, model, Schema } from "mongoose"

export interface IHasBoard extends Document {
    website: Schema.Types.ObjectId
    previewBoard: Schema.Types.ObjectId
}

const HasBoardSchema: Schema = new Schema({
    website: {
        type: Schema.Types.ObjectId,
        ref: "Website"
    },
    previewBoard: {
        type: Schema.Types.ObjectId,
        ref: "PreviewBoard"
    }
})

const NumPerPage = 20

HasBoardSchema.statics.findList = function(query, page) {
    return (
        this.find(query, {
            website: false
        })
            .sort({ follower: "desc" })
            .limit((page - 1) * NumPerPage)
            .populate({
                path: "previewBoard",
                model: "PreviewBoard",
                select: "board name link layoutType cards follower"
            })
            .lean()
    )
}

const HasBoardModel: any = model<IHasBoard>("HasBoard", HasBoardSchema)

export default HasBoardModel
