import { Document, model, Schema } from "mongoose"

export interface ICard {
    code: string
    title: string
    firstAddedInfo?: string
    secondAddedInfo?: string
    thumbnail?: string
    link: string
    publishedDate: string
}

export interface IPreviewBoard extends Document {
    board: Schema.Types.ObjectId
    name: string
    link: string
    layoutType: string
    follower: number
    cards: ICard[]
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
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
})

const PreviewBoardModel: any = model<IPreviewBoard>(
    "PreviewBoard",
    PreviewBoardSchema
)

export default PreviewBoardModel
