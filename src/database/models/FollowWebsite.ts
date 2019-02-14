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

let FollowWebsiteModel

try {
    FollowWebsiteModel = model<IFollowWebsite>(
        "FollowWebsite",
        FollowWebsiteSchema
    )
} catch (error) {
    FollowWebsiteModel = model<IFollowWebsite>("FollowWebsite")
}

export default FollowWebsiteModel
