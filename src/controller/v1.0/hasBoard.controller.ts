// import Joi, { Schema, ValidationResult } from "joi"
// import { Context } from "koa"
// import HasBoardModel, { IHasBoardDocument } from "../../database/models/HasBoard"
// import PreviewBoardModel, { IPreviewBoardDocument } from "../../database/models/PreviewBoard"
// import WebsiteModel, { IWebsiteDocument } from "../../database/models/Website"
// import {
//     ListHasBoardResponse,
//     RemoveHasBoardResponse,
//     WriteHasBoardResponse
// } from "../../types/types"

// /*
//     [GET] /v1.0/has-board/:websiteId
// */
// export const listHasBoard = async (ctx: Context) => {
//     let result: ListHasBoardResponse
//     const page = parseInt(ctx.query.page || 1, 10)
//     const { websiteId } = ctx.params

//     try {
//         const hasBoards: IHasBoardDocument[] = await HasBoardModel.findList(
//             {
//                 website: websiteId
//             },
//             page
//         )

//         result = {
//             ok: true,
//             error: null,
//             hasBoards
//         }

//         ctx.body = hasBoards
//     } catch (error) {
//         result = {
//             ok: false,
//             error: error.message,
//             hasBoards: null
//         }

//         ctx.status = 500
//         ctx.body = result
//     }
// }

// /*
//     [POST] /v1.0/has-board/
// */
// export const writeHasBoard = async (ctx: Context) => {
//     let result: WriteHasBoardResponse
//     const { body } = ctx.request

//     const schema: Schema = Joi.object({
//         websiteId: Joi.string().required(),
//         previewBoardId: Joi.string().required()
//     })

//     const validation: ValidationResult<any> = Joi.validate(body, schema)

//     if (validation.error) {
//         result = {
//             ok: false,
//             error: validation.error
//         }

//         ctx.status = 400
//         ctx.body = result
//         return
//     }

//     const { websiteId, previewBoardId } = body

//     let website: IWebsiteDocument | null = null
//     let previewBoard: IPreviewBoardDocument | null = null

//     try {
//         website = await WebsiteModel.findById(websiteId)
//     } catch (error) {
//         result = {
//             ok: false,
//             error: error.message
//         }

//         ctx.status = 500
//         ctx.body = result
//         return
//     }

//     if (website) {
//         try {
//             previewBoard = await PreviewBoardModel.findById(previewBoardId)
//         } catch (error) {
//             result = {
//                 ok: false,
//                 error: error.message
//             }

//             ctx.status = 500
//             ctx.body = result
//         }
//     } else {
//         result = {
//             ok: false,
//             error: "Website does not found."
//         }

//         ctx.body = result
//         ctx.status = 404
//         return
//     }

//     let hasBoard: IHasBoardDocument | null = null

//     if (previewBoard) {
//         try {
//             hasBoard = await HasBoardModel.findOne({
//                 website: websiteId,
//                 previewBoard: previewBoardId
//             })
//         } catch (error) {
//             result = {
//                 ok: false,
//                 error: error.message
//             }

//             ctx.status = 500
//             ctx.body = result
//             return
//         }
//     } else {
//         result = {
//             ok: false,
//             error: "Board does not found."
//         }

//         ctx.status = 404
//         ctx.body = result
//         return
//     }

//     if (!hasBoard) {
//         try {
//             await new HasBoardModel({
//                 website: websiteId,
//                 previewBoard: previewBoardId
//             }).save()

//             result = {
//                 ok: true,
//                 error: null
//             }

//             ctx.body = result
//             return
//         } catch (error) {
//             result = {
//                 ok: false,
//                 error: error.message
//             }

//             ctx.status = 500
//             ctx.body = result
//             return
//         }
//     } else {
//         result = {
//             ok: false,
//             error: "Website already contains board."
//         }

//         ctx.status = 400
//         ctx.body = result
//         return
//     }
// }

// /*
//     [DELETE] /v1.0/has-board/websites/:websiteId/previewBoards/:previewBoardId
// */
// export const removeHasBoard = async (ctx: Context) => {
//     let result: RemoveHasBoardResponse
//     const { websiteId, previewBoardId } = ctx.params

//     let hasBoard: IHasBoardDocument | null = null

//     try {
//         hasBoard = await HasBoardModel.findOne({
//             website: websiteId,
//             previewBoard: previewBoardId
//         })
//     } catch (error) {
//         result = {
//             ok: false,
//             error: error.message
//         }

//         ctx.status = 500
//         ctx.body = result
//         return
//     }

//     if (hasBoard) {
//         try {
//             await hasBoard.remove()

//             result = {
//                 ok: true,
//                 error: null
//             }

//             ctx.body = result
//         } catch (error) {
//             result = {
//                 ok: false,
//                 error: error.message
//             }

//             ctx.status = 500
//             ctx.body = result
//         }
//     } else {
//         result = {
//             ok: false,
//             error: "HasBoard does not found."
//         }

//         ctx.status = 404
//         ctx.body = result
//     }
// }
