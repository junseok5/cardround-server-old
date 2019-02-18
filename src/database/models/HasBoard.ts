// import { Document, model, Model, Schema } from "mongoose"

// export interface IHasBoardDocument extends Document {
//     _id: Schema.Types.ObjectId
//     website: Schema.Types.ObjectId
//     previewBoard: Schema.Types.ObjectId
// }

// export interface IHasBoardModel extends Model<IHasBoardDocument> {
//     findList: (
//         query: {
//             website: Schema.Types.ObjectId
//         },
//         page: number
//     ) => IHasBoardDocument[]
// }

// const HasBoardSchema: Schema = new Schema({
//     website: {
//         type: Schema.Types.ObjectId,
//         ref: "Website"
//     },
//     previewBoard: {
//         type: Schema.Types.ObjectId,
//         ref: "PreviewBoard"
//     }
// })

// const NumPerPage = 20

// HasBoardSchema.statics.findList = function(query, page) {
//     return this.find(query, {
//         website: false
//     })
//         .sort({ follower: "desc" })
//         .limit((page - 1) * NumPerPage)
//         .populate({
//             path: "previewBoard",
//             model: "PreviewBoard",
//             select: "board name link layoutType cards follower"
//         })
//         .lean()
// }

// export default model<IHasBoardDocument, IHasBoardModel>("HasBoard", HasBoardSchema)
