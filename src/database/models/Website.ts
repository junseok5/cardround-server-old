import { Document, model, Model, Schema } from "mongoose"

export interface IWebsiteDocument extends Document {
    _id: Schema.Types.ObjectId
    name: string
    thumbnail?: string
    link: string
    category: string
    follower: number
    private: boolean
    createdAt: Date
    updatedAt: Date
}

export interface IWebsiteModel extends Model<IWebsiteDocument> {
    findList: (
        query: {
            private?: boolean
            category?: string
            name?: object
        },
        page: number
    ) => IWebsiteDocument[]
    findSearchPreviewList: (query: {
        private: boolean
        name: object
    }) => IWebsiteDocument[]
}

const WebsiteSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    thumbnail: String,
    link: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        required: true,
        index: true
    },
    follower: {
        type: Number,
        default: 0
    },
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

const NumPerPage = 20
const previewNum = 4

WebsiteSchema.statics.findList = function(query, page) {
    return this.find(query, {
        category: false,
        private: false,
        createdAt: false,
        updatedAt: false
    })
        .sort({ follower: "desc" })
        .limit(NumPerPage)
        .skip((page - 1) * NumPerPage)
        .lean()
}

WebsiteSchema.statics.findSearchPreviewList = function(query) {
    return this.find(query, {
        thumbnail: false,
        link: false,
        category: false,
        follower: false,
        private: false,
        createdAt: false,
        updatedAt: false
    })
        .sort({ follower: "desc" })
        .limit(previewNum)
        .lean()
}

export default model<IWebsiteDocument, IWebsiteModel>("Website", WebsiteSchema)
