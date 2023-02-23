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
const ProductServices = require('./services');
const respondServerError = require('../../helpers/respondServerError');
// TODO: All error that's using http-errors library must return as JSON instead
// TODO: All console.log must be removed and replace with logger or something better
class controller {
}
_a = controller;
controller.getProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Check all required fields
    if (!req.body.id) {
        return res.status(422).json({
            status: false,
            errorCode: 'MISSING_FIELD',
            message: 'Some required field is missing'
        });
    }
    try {
        const product = yield ProductServices.getProduct(req.user.payload.id, req.body.id);
        res.status(200).json({
            status: true,
            message: 'Get product successfully',
            product: product
        });
    }
    catch (e) {
        if (e.message === 'Product not found') {
            res.status(404).json({
                status: false,
                errorCode: 'PRODUCT_NOT_FOUND',
                message: 'Product not found',
            });
        }
        else {
            respondServerError(res);
        }
    }
});
controller.getProductList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productList = yield ProductServices.getProductList(req.user.payload.id);
        res.status(200).json({
            status: true,
            message: 'Get product list successfully',
            productList: productList
        });
    }
    catch (e) {
        respondServerError(res);
    }
});
controller.addProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const data = JSON.parse(req.body.data);
    // Check all required fields
    if (!data.name || !data.price) {
        return res.status(422).json({
            status: false,
            errorCode: 'MISSING_FIELD',
            message: 'Some required field is missing'
        });
    }
    try {
        const product = yield ProductServices.addProduct(req.user.payload.id, data.name, data.price, data.detail, req.file);
        res.status(200).json({
            status: true,
            message: 'Add product successfully',
            product: product
        });
    }
    catch (e) {
        respondServerError(res);
    }
});
controller.updateProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const data = JSON.parse(req.body.data);
    // Check all required fields
    if (!data.id) {
        return res.status(422).json({
            status: false,
            errorCode: 'MISSING_FIELD',
            message: 'Some required field is missing'
        });
    }
    try {
        const product = yield ProductServices.updateProduct(req.user.payload.id, data.id, data.name, data.price, data.detail, req.file);
        res.status(200).json({
            status: true,
            message: 'Update product successfully',
            product: product
        });
    }
    catch (e) {
        if (e.message === 'Product not found') {
            res.status(404).json({
                status: false,
                errorCode: 'PRODUCT_NOT_FOUND',
                message: 'Product not found',
            });
        }
        else {
            respondServerError(res);
        }
    }
});
controller.deleteProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Check all required fields
    if (!req.body.id) {
        return res.status(422).json({
            status: false,
            errorCode: 'MISSING_FIELD',
            message: 'Some required field is missing'
        });
    }
    try {
        const product = yield ProductServices.deleteProduct(req.user.payload.id, req.body.id);
        res.status(200).json({
            status: true,
            message: 'Delete product successfully',
            product: product
        });
    }
    catch (e) {
        if (e.message === 'Product not found') {
            res.status(404).json({
                status: false,
                errorCode: 'PRODUCT_NOT_FOUND',
                message: 'Product not found',
            });
        }
        else {
            respondServerError(res);
        }
    }
});
module.exports = controller;
