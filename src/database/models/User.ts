import { Document, model, Model, Schema } from 'mongoose'

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
        required: true
    },
    displayName: {
        type: String,
        required: true
    },
    socialId: {
        type: String,
        required: true
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

let UserModel: Model<IUser>

try {
    UserModel = model('User', UserSchema)
} catch(error) {
    UserModel = model('User')
}

export default UserModel