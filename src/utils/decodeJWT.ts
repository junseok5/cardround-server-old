import jwt from "jsonwebtoken"

const decodeJWT = (token: string) => {
    try {
        const decoded: any = jwt.verify(token, process.env.JWT_TOKEN || "")
        const { _id } = decoded
        const user = {
            _id
        }

        return user
    } catch (error) {
        return null
    }
}

export default decodeJWT
