import { Document, model, Schema } from "mongoose"

export interface ICardDocument {
    _id: Schema.Types.ObjectId
    code: string
    title: string
    firstAddedInfo?: string
    secondAddedInfo?: string
    thumbnail?: string
    link: string
    publishedDate: string
}

export interface IBoardDocument extends Document {
    _id: Schema.Types.ObjectId
    name: string
    link: string
    layoutType: string
    follower: number
    category: string
    cards: ICardDocument[]
    score: number
    private: boolean
    websiteId: Schema.Types.ObjectId
    websiteName: string
    websiteThumbnail?: string
    createdAt: Date
    updatedAt: Date
}

const BoardSchema: Schema = new Schema({
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
    category: {
        type: String,
        required: true
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
    score: {
        type: Number,
        default: 0
    },
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

export default model<IBoardDocument>("Board", BoardSchema)
