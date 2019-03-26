import { Document, model, Model, Schema } from "mongoose"
import hash from "../../utils/hash"

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
    accessToken?: string
    thumbnail?: string
    createdAt: Date
    updatedAt: Date
    validatePassword(password: string): boolean
}

export interface IUserModel extends Model<IUserDocument> {
    localRegister: (params: {
        email: string
        password: string
        displayName: string
    }) => IUserDocument
    findProfileId: (query: {
        provider: string
        profileId: string
    }) => IUserDocument
    socialRegister: (params: {
        email: string
        displayName: string
        thumbnail: string
        provider: string
        accessToken: string
        profileId: string
    }) => IUserDocument
    getProfile: (id: Schema.Types.ObjectId) => IUserDocument | null
}

const UserSchema: Schema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: String,
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
    thumbnail: String,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
})

UserSchema.statics.localRegister = function({ email, password, displayName }) {
    const user = new this({
        email,
        password: hash(password),
        displayName
    })

    return user.save()
}

UserSchema.statics.findProfileId = function({ provider, profileId }) {
    const key = `social.${provider}.id`
    return this.findOne({ [key]: profileId })
}

UserSchema.statics.socialRegister = function({
    email,
    displayName,
    thumbnail,
    provider,
    accessToken,
    profileId
}) {
    const user = new this({
        email,
        displayName,
        thumbnail,
        social: {
            [provider]: {
                id: profileId,
                accessToken
            }
        }
    })

    return user.save()
}

UserSchema.statics.getProfile = function(id) {
    return this.findById(id, {
        social: false,
        password: false,
        createdAt: false,
        updatedAt: false
    })
}

UserSchema.methods.validatePassword = function(password: string) {
    const hashed = hash(password)
    return this.password === hashed
}

export default model<IUserDocument, IUserModel>("User", UserSchema)
