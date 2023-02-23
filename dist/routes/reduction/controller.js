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
const ReductionServices = require('./services');
const respondServerError = require('../../helpers/respondServerError');
// TODO: All error that's using http-errors library must return as JSON instead
// TODO: All console.log must be removed and replace with logger or something better
class controller {
}
_a = controller;
controller.getReduction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Check all required fields
    if (!req.body.id) {
        return res.status(422).json({
            status: false,
            errorCode: 'MISSING_FIELD',
            message: 'Some required field is missing'
        });
    }
    try {
        const reduction = yield ReductionServices.getReduction(req.body.id);
        res.status(200).json({
            status: true,
            message: 'Get reduction successfully',
            reduction: reduction
        });
    }
    catch (e) {
        if (e.message === 'Reduction not found') {
            res.status(404).json({
                status: false,
                errorCode: 'REDUCTION_NOT_FOUND',
                message: 'Reduction not found',
            });
        }
        else if (e.message === 'Product not found') {
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
controller.getReductionList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reductionList = yield ReductionServices.getReductionList(req.body.storeId);
        res.status(200).json({
            status: true,
            message: 'Get reduction list successfully',
            reductionList: reductionList
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
controller.addReduction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Check all required fields
    if (!req.body.productId || !req.body.stock || !req.body.price) {
        return res.status(422).json({
            status: false,
            errorCode: 'MISSING_FIELD',
            message: 'Some required field is missing'
        });
    }
    try {
        const reduction = yield ReductionServices.addReduction(req.user.payload.id, req.body.productId, req.body.stock, req.body.price, req.body.expirationDate);
        res.status(200).json({
            status: true,
            message: 'Add reduction successfully',
            reduction: reduction
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
controller.updateReduction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Check all required fields
    if (!req.body.id) {
        return res.status(422).json({
            status: false,
            errorCode: 'MISSING_FIELD',
            message: 'Some required field is missing'
        });
    }
    try {
        const reduction = yield ReductionServices.updateReduction(req.user.payload.id, req.body.id, req.body.productId, req.body.stock, req.body.price, req.body.expirationDate);
        res.status(200).json({
            status: true,
            message: 'Update reduction successfully',
            reduction: reduction
        });
    }
    catch (e) {
        if (e.message === 'Reduction not found') {
            res.status(404).json({
                status: false,
                errorCode: 'REDUCTION_NOT_FOUND',
                message: 'Reduction not found',
            });
        }
        else if (e.message === 'Product not found') {
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
controller.deleteReduction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Check all required fields
    if (!req.body.id) {
        return res.status(422).json({
            status: false,
            errorCode: 'MISSING_FIELD',
            message: 'Some required field is missing'
        });
    }
    try {
        const reduction = yield ReductionServices.deleteReduction(req.user.payload.id, req.body.id);
        res.status(200).json({
            status: true,
            message: 'Delete reduction successfully',
            reduction: reduction
        });
    }
    catch (e) {
        if (e.message === 'Reduction not found') {
            res.status(404).json({
                status: false,
                errorCode: 'REDUCTION_NOT_FOUND',
                message: 'Reduction not found',
            });
        }
        else if (e.message === 'Product not found') {
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
