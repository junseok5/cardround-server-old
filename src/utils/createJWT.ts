import jwt from "jsonwebtoken"

const createJWT = (id: number): string => {
    const token = jwt.sign(
        {
            _id: id
        },
        process.env.JWT_TOKEN || ""
    )

    return token
}

export default createJWT
