import { Document, model, Model, Schema } from "mongoose"

export interface IUserDocument extends Document {
    _id: Schema.Types.ObjectId
    email: string
    displayName: string
    social: {
        facebook: {
            id: string
            accessToken: string
        }
        google: {
            id: string
            accessToken: string
        }
    }
    accessToken: string
    thumbnail: string
    createdAt: Date
    updatedAt: Date
}

export interface IUserModel extends Model<IUserDocument> {
    findProfileId: (query: {
        provider: string
        profileId: string
    }) => IUserDocument
}

const UserSchema: Schema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    social: {
        facebook: {
            id: String,
            accessToken: String
        },
        google: {
            id: String,
            accessToken: String
        }
    },
    displayName: {
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

UserSchema.statics.findProfileId = function({ provider, profileId }) {
    const key = `social.${provider}.id`
    return this.findOne({ [key]: profileId })
}

export default model<IUserDocument, IUserModel>("User", UserSchema)
