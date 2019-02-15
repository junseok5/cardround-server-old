import { Document, model, Schema } from "mongoose"

export interface IUser extends Document {
    email: string
    displayName: string
    socialId: string
    accessToken: string
    thumbnail: string
    createdAt: Date
    updatedAt: Date
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

UserSchema.statics.findSocialId = function({ id }) {
    return this.findOne({ socialId: id })
}

const UserModel: any = model<IUser>("User", UserSchema)

export default UserModel
