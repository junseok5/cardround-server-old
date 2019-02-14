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

export interface IBoard extends Document {
    name: string
    link: string
    layoutType: string
    follower: number,
    cards: ICard[]
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
        default: "NORMAL"
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
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
})

let BoardModel

try {
    BoardModel = model<IBoard>("Board", BoardSchema)
} catch (error) {
    BoardModel = model<IBoard>("Board")
}

export default BoardModel
