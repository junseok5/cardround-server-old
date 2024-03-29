import FacebookAPI from "fb"
import { google } from "googleapis"

const getFacebookProfile = (accessToken: string) => {
    return FacebookAPI.api("me", {
        fields: ["name", "email", "picture"],
        access_token: accessToken
    }).then(auth => ({
        id: auth.id,
        name: auth.name,
        email: auth.email || null,
        thumbnail: auth.picture.data.url
    }))
}

const getGoogleProfile = (accessToken: string) => {
    const plus = google.plus({
        version: "v1",
        auth: process.env.GOOGLE_API_KEY
    })

    return new Promise((resolve, reject) => {
        plus.people.get(
            {
                userId: "me",
                auth: accessToken
            },
            (error, auth) => {
                if (error) {
                    reject(error)
                    return
                }

                if (auth) {
                    const { id, image, emails, displayName } = auth.data

                    if (emails && image) {
                        const profile = {
                            id,
                            thumbnail: image.url,
                            email: emails[0].value,
                            name: displayName && displayName
                        }

                        resolve(profile)
                    } else {
                        reject("emails or image is note exist")
                        return
                    }
                } else {
                    reject("auth is not exist")
                    return
                }
            }
        )
    })
}

const getSocialProfile = (provider: string, accessToken: string) => {
    const getters = {
        facebook: getFacebookProfile,
        google: getGoogleProfile
    }

    return getters[provider](accessToken)
}

export default getSocialProfile
