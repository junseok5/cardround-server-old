import { Document, model, Schema } from "mongoose"
import { ICardDocument } from "./Board";

export interface IPreviewBoardDocument extends Document {
    _id: Schema.Types.ObjectId
    board: Schema.Types.ObjectId
    name: string
    link: string
    layoutType: string
    follower: number
    cards: ICardDocument[]
    private: boolean
    createdAt: Date
    updatedAt: Date
}

const PreviewBoardSchema: Schema = new Schema({
    board: {
        type: Schema.Types.ObjectId,
        ref: "Board",
        required: true
    },
    name: {
        type: String,
        required: true,
        index: true
    },
    link: {
        type: String,
        required: true
    },
    layoutType: {
        type: String,
        default: "PHOTO_NORMAL"
    },
    follower: {
        type: Number,
        default: 0
    },
    cards: [
        {
            code: {
                type: String,
                required: true
            },
            title: {
                type: String,
                required: true
            },
            firstAddedInfo: String,
            secondeAddedInfo: String,
            thumbnail: String,
            link: {
                type: String,
                required: true
            },
            publishedDate: String
        }
    ],
    private: {
        type: Boolean,
        default: true
    },
    websiteId: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true
    },
    websiteThumbnail: String,
    websiteName: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
})

export default model<IPreviewBoardDocument>("PreviewBoard", PreviewBoardSchema)
