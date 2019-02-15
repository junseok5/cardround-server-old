import { Document, model, Schema } from "mongoose"

export interface IFollowWebsite extends Document {
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

const FollowWebsiteModel: any = model<IFollowWebsite>(
    "FollowWebsite",
    FollowWebsiteSchema
)

export default FollowWebsiteModel
