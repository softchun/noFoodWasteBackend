import { Request, Response } from "express";

const AuthServices = require('./services')
const respondServerError = require('../../helpers/respondServerError');

// TODO: All error that's using http-errors library must return as JSON instead
// TODO: All console.log must be removed and replace with logger or something better
class controller {
    static register = async (req: Request, res: Response, next: any) => {
        // Check all required fields
        if (!req.body.email || !req.body.password || !req.body.name) {
            return res.status(422).json({
                status: false,
                errorCode: 'MISSING_FIELD',
                message: 'Some required field is missing'
            })
        }
        try {
            await AuthServices.register(req.body.email, req.body.password, req.body.name);
            res.status(200).json({
                status: true,
                message: 'User created successfully',
            })
        } catch (e) {
            if (e.message === 'This email has already registered') {
                res.status(200).json({
                    status: false,
                    errorCode: 'EMAIL_EXIST',
                    message: 'This email has already registered',
                })
            } else if (e.message === 'Invalid email') {
                res.status(200).json({
                    status: false,
                    errorCode: 'INVALID_EMAIL',
                    message: "Invalid email"
                })
            } else if (e.message === 'Password not meet requirement') {
                res.status(200).json({
                    status: false,
                    errorCode: 'PASSWORD_NOT_MEET_REQUIREMENT',
                    message: 'Password need 8 or more characters with a mix of letters and numbers',
                })
            } else {
                respondServerError(res);
            }
        }
    }

    static login = async (req: Request, res: Response, next: any) => {
        // Check all required fields
        if (!req.body.email || !req.body.password) {
            return res.status(422).json({
                status: false,
                errorCode: 'MISSING_FIELD',
                message: 'Some required field is missing'
            })
        }
        try {
            const user = await AuthServices.login(req.body.email, req.body.password);
            res.status(200)
                .cookie('access_token', user.accessToken)
                .json({
                    status: true,
                    message: 'User logged in successfully',
                    data: user
                })
        } catch (e) {
            if (e.message === "User not found") {
                res.status(200).json({
                    status: false,
                    errorCode: 'USER_NOT_FOUND',
                    message: 'User not found',
                })
            } else if (e.message === "Wrong password") {
                res.status(401).json({
                    status: false,
                    errorCode: 'WRONG_PASSWORD',
                    message: 'Wrong password',
                })
            } else {
                respondServerError(res);
            }
        }
    }

    static logout = async (req: Request, res: Response, next: any) => {
        try {
            res.clearCookie('access_token')
                .status(200).json({
                    status: true,
                    message: 'User logged out successfully',
                });
        } catch (e) {
            respondServerError(res);
        }
    }

    static checkAccountExist = async (req: Request, res: Response, next: any) => {
        // Check all required fields
        if (!req.body.email) {
            return res.status(422).json({
                status: false,
                errorCode: 'MISSING_FIELD',
                message: 'Some required field is missing'
            })
        }
        try {
            const searchResult = await AuthServices.checkAccountExist(req.body.email);
            if (searchResult) {
                res.status(200).json({
                    status: true,
                    message: 'Account is not exist',
                })
            } else {
                res.status(409).json({
                    status: false,
                    errorCode: 'EMAIL_EXIST',
                    message: 'Account has already exist',
                })
            }
        } catch (e) {
            respondServerError(res);
        }
    }

    static getUser = async (req: any, res: Response, next: any) => {
        try {
            const user = await AuthServices.getUser(req.user.payload.id);
            res.status(200).json({
                status: true,
                message: 'Get user successfully',
                user: user
            })
        } catch (e) {
            if (e.message === "User not found") {
                res.status(200).json({
                    status: false,
                    errorCode: 'USER_NOT_FOUND',
                    message: 'User not found',
                })
            } else {
                console.log(e);
                respondServerError(res);
            }
        }
    }
    
    static getMyStore = async (req: any, res: Response, next: any) => {
        try {
            const store = await AuthServices.getStore(req.user.payload.id);
            res.status(200).json({
                status: true,
                message: 'Get store detail successfully',
                store: store
            })
        } catch (e) {
            if (e.message === "Store not found") {
                res.status(200).json({
                    status: false,
                    errorCode: 'STORE_NOT_FOUND',
                    message: 'Store not found',
                })
            } else {
                console.log(e);
                respondServerError(res);
            }
        }
    }
    
    static getStore = async (req: Request, res: Response, next: any) => {
        // Check all required fields
        if (!req.params.id) {
            return res.status(422).json({
                status: false,
                errorCode: 'MISSING_FIELD',
                message: 'Some required field is missing'
            })
        }
        try {
            const store = await AuthServices.getStore(req.params.id);
            res.status(200).json({
                status: true,
                message: 'Get store successfully',
                store: store
            })
        } catch (e) {
            if (e.message === "Store not found") {
                res.status(200).json({
                    status: false,
                    errorCode: 'STORE_NOT_FOUND',
                    message: 'Store not found',
                })
            } else {
                console.log(e);
                respondServerError(res);
            }
        }
    }
    
    static getStoreList = async (req: Request, res: Response, next: any) => {
        try {
            const storeList = await AuthServices.getStoreList(req.query.keyword);
            res.status(200).json({
                status: true,
                message: 'Get store list successfully',
                storeList: storeList
            })
        } catch (e) {
            if (e.message === "Store not found") {
                res.status(200).json({
                    status: false,
                    errorCode: 'STORE_NOT_FOUND',
                    message: 'Store not found',
                })
            } else {
                console.log(e);
                respondServerError(res);
            }
        }
    }
    
    static updateStore = async (req: any, res: Response, next: any) => {
        try {
            const store = await AuthServices.updateStore(
                req.user.payload.id,
                req.body.name,
                req.body.openTime,
                req.body.isClosed,
                req.body.detail,
                req.body.address,
                req.body.location,
                req.body.profileImage,
                req.body.coverImage
            );
            res.status(200).json({
                status: true,
                message: 'Update store successfully',
                store: store
            })
        } catch (e) {
            if (e.message === "Store not found") {
                res.status(200).json({
                    status: false,
                    errorCode: 'STORE_NOT_FOUND',
                    message: 'Store not found',
                })
            } else {
                console.log(e);
                respondServerError(res);
            }
        }
    }
}

module.exports = controller;