import { Document, model, Schema } from "mongoose"

export interface IWebsite extends Document {
    name: string
    thumbnail?: string
    link: string
    category: string
    follower: number
    private: boolean
    createdAt: Date
    updatedAt: Date
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

WebsiteSchema.statics.findList = function(query, page) {
    return this.find(query, {
        category: false,
        createdAt: false,
        updatedAt: false
    })
        .sort({ follower: "desc" })
        .limit((page - 1) * NumPerPage)
        .lean()
}

const WebsiteModel: any = model<IWebsite>("Website", WebsiteSchema)

export default WebsiteModel
