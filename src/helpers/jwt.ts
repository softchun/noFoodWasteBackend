const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

/**
 * Sign the new access token and return it
 * @param payload - the payload to sign
 * @returns {Promise<unknown>} - the signed token
 */
function signAccessToken(payload: any): any {
    return new Promise((resolve, reject) => {
        // TODO: This is a temporary that the token will expire in 7 days, need to clarify on this
        jwt.sign({ payload }, accessTokenSecret, { expiresIn: '7d' }, (err: any, token: string) => {
            if (err) {
                reject(createError.InternalServerError())
            }
            resolve(token)
        })
    })
}

/**
 * Verify the access token and return the payload
 * @param token - the token to verify
 * @returns {Promise<unknown>} - the payload that was signed
 */
function verifyAccessToken(token: string): any {
    return new Promise((resolve, reject) => {
        jwt.verify(token, accessTokenSecret, {}, (err, payload) => {
            if (err) {
                const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message
                return reject(createError.Unauthorized(message))
            }
            resolve(payload)
        })
    })
}

module.exports = {
    signAccessToken,
    verifyAccessToken
}
