import { Response } from "express";

function respondServerError(res: Response) {
    return res.status(500).json({
        status: false,
        errorCode: 'UNKNOWN_ERROR',
        message: 'Something went wrong. Please try again later.',
    })
}

module.exports = respondServerError;