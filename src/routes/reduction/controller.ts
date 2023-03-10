import { Response } from "express";

const ReductionServices = require('./services')
const respondServerError = require('../../helpers/respondServerError');

class controller {
    static getReduction = async (req: any, res: Response, next: any) => {
        // Check all required fields
        if (!req.params.id) {
            return res.status(422).json({
                status: false,
                errorCode: 'MISSING_FIELD',
                message: 'Some required field is missing'
            })
        }
        try {
            const reduction = await ReductionServices.getReduction(req.params.id);
            res.status(200).json({
                status: true,
                message: 'Get reduction successfully',
                reduction: reduction
            })
        } catch (e) {
            if (e.message === 'Reduction not found') {
                res.status(404).json({
                    status: false,
                    errorCode: 'REDUCTION_NOT_FOUND',
                    message: 'Reduction not found',
                })
            } else if (e.message === 'Product not found') {
                res.status(404).json({
                    status: false,
                    errorCode: 'PRODUCT_NOT_FOUND',
                    message: 'Product not found',
                })
            } else {
                respondServerError(res);
            }
        }
    }
    
    static getReductionList = async (req: any, res: Response, next: any) => {
        try {
            const reductionList = await ReductionServices.getReductionList(
                req.query.storeId,
                req.query.keyword,
                parseInt(req.query.skip),
                parseInt(req.query.limit),
                parseInt(req.query.sort),
            );
            res.status(200).json({
                status: true,
                message: 'Get reduction list successfully',
                reductionList: reductionList
            })
        } catch (e) {
            if (e.message === 'Product not found') {
                res.status(404).json({
                    status: false,
                    errorCode: 'PRODUCT_NOT_FOUND',
                    message: 'Product not found',
                })
            } else {
                respondServerError(res);
            }
        }
    }
    
    static getReductionListFilter = async (req: any, res: Response, next: any) => {
        try {
            const reductionList = await ReductionServices.getReductionListFilter(req.body.keyword, req.body.storeId);
            res.status(200).json({
                status: true,
                message: 'Get reduction list successfully',
                reductionList: reductionList
            })
        } catch (e) {
            if (e.message === 'Product not found') {
                res.status(404).json({
                    status: false,
                    errorCode: 'PRODUCT_NOT_FOUND',
                    message: 'Product not found',
                })
            } else {
                respondServerError(res);
            }
        }
    }

    static addReduction = async (req: any, res: Response, next: any) => {
        // Check all required fields
        if (!req.body.productId || !req.body.stock || !req.body.price) {
            return res.status(422).json({
                status: false,
                errorCode: 'MISSING_FIELD',
                message: 'Some required field is missing'
            })
        }
        try {
            const reduction = await ReductionServices.addReduction(
                req.user.payload.id,
                req.body.productId,
                req.body.stock,
                req.body.price,
                req.body.expirationDate,
                req.body.bestBeforeDate,
            );
            res.status(200).json({
                status: true,
                message: 'Add reduction successfully',
                reduction: reduction
            })
        } catch (e) {
            if (e.message === 'Product not found') {
                res.status(404).json({
                    status: false,
                    errorCode: 'PRODUCT_NOT_FOUND',
                    message: 'Product not found',
                })
            } else {
                respondServerError(res);
            }
        }
    }

    static updateReduction = async (req: any, res: Response, next: any) => {
        // Check all required fields
        if (!req.body.id) {
            return res.status(422).json({
                status: false,
                errorCode: 'MISSING_FIELD',
                message: 'Some required field is missing'
            })
        }
        try {
            const reduction = await ReductionServices.updateReduction(
                req.user.payload.id,
                req.body.id,
                req.body.productId,
                req.body.stock,
                req.body.price,
                req.body.expirationDate,
                req.body.bestBeforeDate,
            );
            res.status(200).json({
                status: true,
                message: 'Update reduction successfully',
                reduction: reduction
            })
        } catch (e) {
            if (e.message === 'Reduction not found') {
                res.status(404).json({
                    status: false,
                    errorCode: 'REDUCTION_NOT_FOUND',
                    message: 'Reduction not found',
                })
            } else if (e.message === 'Product not found') {
                res.status(404).json({
                    status: false,
                    errorCode: 'PRODUCT_NOT_FOUND',
                    message: 'Product not found',
                })
            } else {
                respondServerError(res);
            }
        }
    }

    static deleteReduction = async (req: any, res: Response, next: any) => {
        // Check all required fields
        if (!req.body.id) {
            return res.status(422).json({
                status: false,
                errorCode: 'MISSING_FIELD',
                message: 'Some required field is missing'
            })
        }
        try {
            const reduction = await ReductionServices.deleteReduction(req.user.payload.id, req.body.id);
            res.status(200).json({
                status: true,
                message: 'Delete reduction successfully',
                reduction: reduction
            })
        } catch (e) {
            if (e.message === 'Reduction not found') {
                res.status(404).json({
                    status: false,
                    errorCode: 'REDUCTION_NOT_FOUND',
                    message: 'Reduction not found',
                })
            } else if (e.message === 'Product not found') {
                res.status(404).json({
                    status: false,
                    errorCode: 'PRODUCT_NOT_FOUND',
                    message: 'Product not found',
                })
            } else {
                respondServerError(res);
            }
        }
    }
}

module.exports = controller;