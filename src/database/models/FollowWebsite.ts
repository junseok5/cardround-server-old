import { Document, model, Schema } from "mongoose"

export interface IFollowWebsiteDocument extends Document {
    _id: Schema.Types.ObjectId
    user: Schema.Types.ObjectId
    website: Schema.Types.ObjectId
}

const FollowWebsiteSchema: Schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    website: {
        type: Schema.Types.ObjectId,
        ref: "Website"
    }
})

export default model<IFollowWebsiteDocument>("FollowWebsite", FollowWebsiteSchema)
