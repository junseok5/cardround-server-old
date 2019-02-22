import { Document, model, Model, Schema } from "mongoose"
import { ICardDocument } from "./Board"

export interface IPreviewBoardDocument extends Document {
    _id: Schema.Types.ObjectId
    board: Schema.Types.ObjectId
    name: string
    link: string
    layoutType: string
    follower: number
    category: string
    cards: ICardDocument[]
    private: boolean
    websiteId: Schema.Types.ObjectId
    websiteName: string
    websiteThumbnail?: string
    createdAt: Date
    updatedAt: Date
}

export interface IPreviewBoardModel extends Model<IPreviewBoardDocument> {
    findList: (
        query: {
            private?: boolean
            websiteId?: string
            keyword?: string
            name?: object
        },
        page: number
    ) => IPreviewBoardDocument[]
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
    category: {
        type: String,
        required: true,
        index: true
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

const NumPerPage = 20

PreviewBoardSchema.statics.findList = function(query, page) {
    return this.find(query, {
        createdAt: false,
        updatedAt: false
    })
        .sort({ follower: "desc" })
        .limit((page - 1) * NumPerPage)
        .lean()
}

export default model<IPreviewBoardDocument, IPreviewBoardModel>(
    "PreviewBoard",
    PreviewBoardSchema
)
