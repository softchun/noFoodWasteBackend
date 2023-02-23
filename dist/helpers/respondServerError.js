"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function respondServerError(res) {
    return res.status(500).json({
        status: false,
        errorCode: 'UNKNOWN_ERROR',
        message: 'Something went wrong. Please try again later.',
    });
}
module.exports = respondServerError;
