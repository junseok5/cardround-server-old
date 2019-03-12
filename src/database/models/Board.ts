import { Document, model, Model, Schema } from "mongoose"

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

export interface IBoardModel extends Model<IBoardDocument> {
    findList: (
        query: {
            private?: boolean
            websiteId?: string
            keyword?: string
            name?: object
        },
        page: number
    ) => IBoardDocument[]
    findSearchPreviewList: (query: {
        private: boolean
        name: object
    }) => IBoardDocument[]
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

const NumPerPage = 20
const previewNum = 4

BoardSchema.statics.findList = function(query, page) {
    return this.find(query, {
        createdAt: false,
        updatedAt: false
    })
        .sort({ score: "desc" })
        .limit(NumPerPage)
        .skip((page - 1) * NumPerPage)
        .lean()
}

BoardSchema.statics.findSearchPreviewList = function(query) {
    return this.find(query, { name: true })
        .sort({ follower: "desc" })
        .limit(previewNum)
        .lean()
}

export default model<IBoardDocument, IBoardModel>("Board", BoardSchema)
