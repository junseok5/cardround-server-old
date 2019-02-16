import jwt from "jsonwebtoken"
import { Schema } from "mongoose";

const createJWT = (id: Schema.Types.ObjectId): string => {
    const token = jwt.sign(
        {
            _id: id
        },
        process.env.JWT_TOKEN || ""
    )

    return token
}

export default createJWT
