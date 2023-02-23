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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const AuthServices = require('./services');
const respondServerError = require('../../helpers/respondServerError');
// TODO: All error that's using http-errors library must return as JSON instead
// TODO: All console.log must be removed and replace with logger or something better
class controller {
}
_a = controller;
controller.register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Check all required fields
    if (!req.body.email || !req.body.password || !req.body.name) {
        return res.status(422).json({
            status: false,
            errorCode: 'MISSING_FIELD',
            message: 'Some required field is missing'
        });
    }
    try {
        yield AuthServices.register(req.body.email, req.body.password, req.body.name);
        res.status(200).json({
            status: true,
            message: 'User created successfully',
        });
    }
    catch (e) {
        if (e.message === 'This email has already registered') {
            res.status(200).json({
                status: false,
                errorCode: 'EMAIL_EXIST',
                message: 'This email has already registered',
            });
        }
        else if (e.message === 'Invalid email') {
            res.status(200).json({
                status: false,
                errorCode: 'INVALID_EMAIL',
                message: "Invalid email"
            });
        }
        else if (e.message === 'Password not meet requirement') {
            res.status(200).json({
                status: false,
                errorCode: 'PASSWORD_NOT_MEET_REQUIREMENT',
                message: 'Password need 8 or more characters with a mix of letters and numbers',
            });
        }
        else {
            console.log(e);
            respondServerError(res);
        }
    }
});
controller.login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Check all required fields
    if (!req.body.email || !req.body.password) {
        return res.status(422).json({
            status: false,
            errorCode: 'MISSING_FIELD',
            message: 'Some required field is missing'
        });
    }
    try {
        const user = yield AuthServices.login(req.body.email, req.body.password);
        res.status(200)
            .cookie('access_token', user.accessToken, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production',
        })
            .json({
            status: true,
            message: 'User logged in successfully',
            data: user
        });
    }
    catch (e) {
        if (e.message === "User not found") {
            res.status(200).json({
                status: false,
                errorCode: 'USER_NOT_FOUND',
                message: 'User not found',
            });
        }
        else if (e.message === "Wrong password") {
            res.status(401).json({
                status: false,
                errorCode: 'WRONG_PASSWORD',
                message: 'Wrong password',
            });
        }
        else {
            console.log(e);
            respondServerError(res);
        }
    }
});
controller.logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie('access_token')
            .status(200).json({
            status: true,
            message: 'User logged out successfully',
        });
    }
    catch (e) {
        console.log(e);
        respondServerError(res);
    }
});
controller.checkAccountExist = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Check all required fields
    if (!req.body.email) {
        return res.status(422).json({
            status: false,
            errorCode: 'MISSING_FIELD',
            message: 'Some required field is missing'
        });
    }
    try {
        const searchResult = yield AuthServices.checkAccountExist(req.body.email);
        if (searchResult) {
            res.status(200).json({
                status: true,
                message: 'Account is not exist',
            });
        }
        else {
            res.status(409).json({
                status: false,
                errorCode: 'EMAIL_EXIST',
                message: 'Account has already exist',
            });
        }
    }
    catch (e) {
        console.log(e);
        respondServerError(res);
    }
});
controller.checkVerified = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json({
            status: true,
            message: 'Verify successfully',
            user: {
                id: req.user.payload.id,
                email: req.user.payload.email,
                role: req.user.payload.role,
            }
        });
    }
    catch (e) {
        console.log(e);
        respondServerError(res);
    }
});
controller.getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield AuthServices.getUser(req.user.payload.id);
        res.status(200).json({
            status: true,
            message: 'Get user successfully',
            user: user
        });
    }
    catch (e) {
        if (e.message === "User not found") {
            res.status(200).json({
                status: false,
                errorCode: 'USER_NOT_FOUND',
                message: 'User not found',
            });
        }
        else {
            console.log(e);
            respondServerError(res);
        }
    }
});
module.exports = controller;
