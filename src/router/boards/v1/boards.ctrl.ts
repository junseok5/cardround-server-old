import { Context } from "koa";
import BoardModel, { IBoard } from "../../../database/models/Board";
import { ReadBoardResponse } from "../../../types/types";

export const listBoard = async (ctx: Context) => {
    // 사용자 많아지면 도입
}

export const readBoard = async (ctx: Context) => {
    let result: ReadBoardResponse
    const { id } = ctx.params

    try {
        const board: IBoard = await BoardModel.findById(id, {
            createdAt: false,
            updatedAt: false
        }).exec()

        if (board) {
            result = {
                ok: true,
                error: null,
                board
            }

            ctx.body = result
        } else {
            result = {
                ok: false,
                error: "Board does not found.",
                board: null
            }

            ctx.status = 404
            ctx.body = result
        }
    } catch(error) {
        result = {
            ok: false,
            error: error.message,
            board: null
        }

        ctx.status = 500
        ctx.body = result
    }
}

export const writeBoard = async (ctx: Context) => {

}

export const updateBoard = async (ctx: Context) => {

}