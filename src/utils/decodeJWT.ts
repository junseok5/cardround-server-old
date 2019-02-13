import jwt from "jsonwebtoken"
import UserModel, { IUser } from "../database/models/User";

const decodeJWT = async (token: string): Promise<IUser | null> => {
    try {
        const decoded: any = jwt.verify(token, process.env.JWT_TOKEN || "")
        const { id } = decoded
        const user: IUser | null = await UserModel.findOne({ id })

        return user
    } catch (error) {
        return null
    }
}

export default decodeJWT
