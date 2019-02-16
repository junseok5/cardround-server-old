import { Document, model, Model, Schema } from "mongoose"

export interface IUserDocument extends Document {
    _id: Schema.Types.ObjectId
    email: string
    displayName: string
    socialId: string
    accessToken: string
    thumbnail: string
    createdAt: Date
    updatedAt: Date
}

export interface IUserModel extends Model<IUserDocument> {
    findSocialId: (socialId: string) => IUserDocument
}

const UserSchema: Schema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    displayName: {
        type: String,
        required: true
    },
    socialId: {
        type: String,
        required: true,
        unique: true
    },
    accessToken: {
        type: String,
        required: true
    },
    thumbnail: {
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

UserSchema.statics.findSocialId = function(socialId) {
    return this.findOne({ socialId })
}

export default model<IUserDocument, IUserModel>("User", UserSchema)
