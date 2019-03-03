import jwt from "jsonwebtoken"

const decodeJWT = (token: string) => {
    try {
        const decoded: any = jwt.verify(token, process.env.JWT_TOKEN || "")
        const { _id, email, displayName, thumbnail } = decoded
        const user = {
            _id,
            email,
            displayName,
            thumbnail
        }

        return user
    } catch (error) {
        return null
    }
}

export default decodeJWT
