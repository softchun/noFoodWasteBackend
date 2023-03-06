import { Response } from "express";

const ProductServices = require('./services')
const respondServerError = require('../../helpers/respondServerError');

// TODO: All error that's using http-errors library must return as JSON instead
// TODO: All console.log must be removed and replace with logger or something better
class controller {
    static getProduct = async (req: any, res: Response, next: any) => {
        // Check all required fields
        if (!req.params.id) {
            return res.status(422).json({
                status: false,
                errorCode: 'MISSING_FIELD',
                message: 'Some required field is missing'
            })
        }
        try {
            const product = await ProductServices.getProduct(req.user.payload.id, req.params.id);
            res.status(200).json({
                status: true,
                message: 'Get product successfully',
                product: product
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
    
    static getProductList = async (req: any, res: Response, next: any) => {
        try {
            const productList = await ProductServices.getProductList(req.user.payload.id, req.query?.keyword);
            res.status(200).json({
                status: true,
                message: 'Get product list successfully',
                productList: productList
            })
        } catch (e) {
            respondServerError(res);
        }
    }

    static addProduct = async (req: any, res: Response, next: any) => {
        // Check all required fields
        if (!req.body.name || !req.body.price) {
            return res.status(422).json({
                status: false,
                errorCode: 'MISSING_FIELD',
                message: 'Some required field is missing'
            })
        }
        try {
            const product = await ProductServices.addProduct(
                req.user.payload.id,
                req.body.name,
                req.body.price,
                req.body.detail,
                req.body.image,
            );
            res.status(200).json({
                status: true,
                message: 'Add product successfully',
                product: product
            })
        } catch (e) {
            respondServerError(res);
        }
    }

    static updateProduct = async (req: any, res: Response, next: any) => {
        // Check all required fields
        if (!req.body.id) {
            return res.status(422).json({
                status: false,
                errorCode: 'MISSING_FIELD',
                message: 'Some required field is missing'
            })
        }
        try {
            const product = await ProductServices.updateProduct(
                req.user.payload.id,
                req.body.id,
                req.body.name,
                req.body.price,
                req.body.detail,
                req.body.image,
            );
            res.status(200).json({
                status: true,
                message: 'Update product successfully',
                product: product
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

    static deleteProduct = async (req: any, res: Response, next: any) => {
        // Check all required fields
        if (!req.body.id) {
            return res.status(422).json({
                status: false,
                errorCode: 'MISSING_FIELD',
                message: 'Some required field is missing'
            })
        }
        try {
            const product = await ProductServices.deleteProduct(req.user.payload.id, req.body.id);
            res.status(200).json({
                status: true,
                message: 'Delete product successfully',
                product: product
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
}

module.exports = controller;