import { Response, Request } from 'express';
const myjwt = require('../helpers/jwt');

const auth = async (req: any, res: Response, next: any) => {
    // const token = req.cookies.access_token;
    
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({
            status: false,
            message: 'Authentication code not found'
        })
    }
    await myjwt.verifyAccessToken(token).then(user => {
        req.user = user
        next()
    }).catch(err => {
        return res.status(401).json({
            status: false,
            message: 'Authentication code is invalid'
        })
    })
}

module.exports = auth;