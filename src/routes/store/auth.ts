import { Response } from "express";

const myjwt = require('../../helpers/jwt');

const authStore = async (req: any, res: Response, next: any) => {
    // const token = req.cookies.access_token;
    
    const token = req.headers['authorization'];
    // console.log('token: ', token)
    if (!token) {
        return res.status(401).json({
            status: false,
            message: 'Authentication code not found'
        })
    }
    await myjwt.verifyAccessToken(token).then((user: any) => {
        // console.log('user: ', user)
        if (user.payload.role !== 'store') {
            return res.status(401).json({
                status: false,
                message: 'Authentication code is invalid'
            })
        }
        req.user = user
        next()
    }).catch((err: any) => {
        return res.status(401).json({
            status: false,
            message: 'Authentication code is invalid'
        })
    })
}

module.exports = authStore;