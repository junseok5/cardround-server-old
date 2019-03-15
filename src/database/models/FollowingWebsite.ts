import { Document, model, Schema } from "mongoose"

export interface IFollowingWebsiteDocument extends Document {
    _id: Schema.Types.ObjectId
    user: Schema.Types.ObjectId
    website: Schema.Types.ObjectId
}

const FollowingWebsiteSchema: Schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    website: {
        type: Schema.Types.ObjectId,
        ref: "Website"
    }
})

export default model<IFollowingWebsiteDocument>(
    "FollowingWebsite",
    FollowingWebsiteSchema
)
