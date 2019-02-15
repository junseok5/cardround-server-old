import { Document, model, Schema } from "mongoose"

export interface IHasBoard extends Document {
    website: Schema.Types.ObjectId
    board: Schema.Types.ObjectId
}

const HasBoardSchema: Schema = new Schema({
    website: {
        type: Schema.Types.ObjectId,
        ref: "Website"
    },
    board: {
        type: Schema.Types.ObjectId,
        ref: "Board"
    }
})

let HasBoardModel

try {
    HasBoardModel = model<IHasBoard>(
        "HasBoard",
        HasBoardSchema
    )
} catch (error) {
    HasBoardModel = model<IHasBoard>("HasBoard")
}

export default HasBoardModel
