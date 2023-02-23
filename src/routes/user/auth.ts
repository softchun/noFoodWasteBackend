import { Response } from "express";

const myjwt = require('../../helpers/jwt');

const authUser = async (req: any, res: Response, next: any) => {
    // const token = req.cookies.access_token;
    
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({
            status: false,
            message: 'Authentication code not found'
        })
    }
    await myjwt.verifyAccessToken(token).then((user: any) => {
        if (user.payload.role !== 'customer') {
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

module.exports = authUser;