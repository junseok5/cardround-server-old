import { Document, model, Model, Schema } from "mongoose"

export interface ICategoryDocument extends Document {
    _id: Schema.Types.ObjectId
    type: string
    name: string
    score: number
}

export interface ICategoryModel extends Model<ICategoryDocument> {
    findList: (type: string) => ICategoryDocument[]
}

const CategorySchema: Schema = new Schema({
    type: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        default: 0
    }
})

CategorySchema.statics.findList = function(type) {
    return this.find({ type }, { type: false })
        .sort({ score: "desc" })
        .lean()
}

export default model<ICategoryDocument, ICategoryModel>(
    "Category",
    CategorySchema
)
