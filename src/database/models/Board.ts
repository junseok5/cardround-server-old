import { Document, Model, model, Schema } from "mongoose"

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
    cards: ICard[]
    createdAt: Date
    updatedAt: Date
}

const BoardSchema: Schema = new Schema({
    name: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    layoutType: {
        type: String,
        default: "NORMAL"
    },
    cards: {
        type: [
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
        default: []
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

let BoardModel: Model<IBoard>

try {
    BoardModel = model<IBoard>('Board', BoardSchema)
} catch(error) {
    BoardModel = model<IBoard>('Board')
}

export default BoardModel
