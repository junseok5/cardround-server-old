import { Context } from "koa"
import PreviewBoard, {
    IPreviewBoardDocument
} from "../../database/models/PreviewBoard"
import { ListPBOfWebResponse } from "../../types/types"

export const listPreviewBoard = async (ctx: Context) => {
    let result: ListPBOfWebResponse
    const page = parseInt(ctx.query.page || 1, 10)
    const keyword: string = ctx.query.keyword
    const category: string = ctx.query.category
    const websiteId: string = ctx.params.websiteId

    let query = {}
    const baseQuery = { private: false }

    query = websiteId ? { ...baseQuery, websiteId } : { ...baseQuery }
    query = keyword
        ? {
              ...query,
              name: {
                  $regex: keyword,
                  $options: "i"
              }
          }
        : { ...query }
    query = category
        ? {
              ...query,
              category
          }
        : { ...query }

    if (page < 1) {
        result = {
            ok: false,
            error: "Page must have more than 1",
            previewBoards: null
        }

        ctx.status = 400
        ctx.body = result
        return
    }

    try {
        const previewBoards: IPreviewBoardDocument[] = await PreviewBoard.findList(
            query,
            page
        )

        result = {
            ok: true,
            error: null,
            previewBoards
        }

        ctx.body = result
    } catch (error) {
        result = {
            ok: false,
            error: error.message,
            previewBoards: null
        }

        ctx.status = 500
        ctx.body = result
    }
}
