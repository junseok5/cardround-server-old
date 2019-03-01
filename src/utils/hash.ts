import crypto from "crypto"

const hash = (password: string) => {
    return crypto
        .createHmac("sha256", process.env.PASSWORD_HASH_KEY || "")
        .update(password)
        .digest("hex")
}

export default hash
