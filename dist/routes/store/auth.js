"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const myjwt = require('../../helpers/jwt');
const authStore = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // const token = req.cookies.access_token;
    const token = req.headers['authorization'];
    // console.log('token: ', token)
    if (!token) {
        return res.status(401).json({
            status: false,
            message: 'Authentication code not found'
        });
    }
    yield myjwt.verifyAccessToken(token).then((user) => {
        // console.log('user: ', user)
        if (user.payload.role !== 'store') {
            return res.status(401).json({
                status: false,
                message: 'Authentication code is invalid'
            });
        }
        req.user = user;
        next();
    }).catch((err) => {
        return res.status(401).json({
            status: false,
            message: 'Authentication code is invalid'
        });
    });
});
module.exports = authStore;
