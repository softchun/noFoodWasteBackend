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
const OrderServices = require('./services');
const respondServerError = require('../../helpers/respondServerError');
// TODO: All error that's using http-errors library must return as JSON instead
// TODO: All console.log must be removed and replace with logger or something better
class controller {
}
_a = controller;
controller.getOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Check all required fields
    if (!req.body.id) {
        return res.status(422).json({
            status: false,
            errorCode: 'MISSING_FIELD',
            message: 'Some required field is missing'
        });
    }
    try {
        const order = yield OrderServices.getOrder(req.body.id);
        res.status(200).json({
            status: true,
            message: 'Get order successfully',
            order: order
        });
    }
    catch (e) {
        if (e.message === 'Order not found') {
            res.status(404).json({
                status: false,
                errorCode: 'ORDER_NOT_FOUND',
                message: 'Order not found',
            });
        }
        else if (e.message === 'Store not found') {
            res.status(404).json({
                status: false,
                errorCode: 'STORE_NOT_FOUND',
                message: 'Store not found',
            });
        }
        else if (e.message === 'Cart item not found') {
            res.status(404).json({
                status: false,
                errorCode: 'CART_ITEM_NOT_FOUND',
                message: 'Cart item not found',
            });
        }
        else if (e.message === 'Reduction not found') {
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
controller.getOrderList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.user.payload.role === 'customer') {
            const orderList = yield OrderServices.getOrderList(req.user.payload.id, null, req.body.status);
            res.status(200).json({
                status: true,
                message: 'Get order list successfully',
                orderList: orderList
            });
        }
        else {
            const orderList = yield OrderServices.getOrderList(null, req.user.payload.id, req.body.status);
            res.status(200).json({
                status: true,
                message: 'Get order list successfully',
                orderList: orderList
            });
        }
    }
    catch (e) {
        if (e.message === 'Cart item not found') {
            res.status(404).json({
                status: false,
                errorCode: 'CART_ITEM_NOT_FOUND',
                message: 'Cart item not found',
            });
        }
        else if (e.message === 'Reduction not found') {
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
controller.addOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Check all required fields
    if (!req.body.reduction || !req.body.storeId) {
        return res.status(422).json({
            status: false,
            errorCode: 'MISSING_FIELD',
            message: 'Some required field is missing'
        });
    }
    try {
        const order = yield OrderServices.addOrder(req.user.payload.id, req.body.storeId, req.body.reduction);
        res.status(200).json({
            status: true,
            message: 'Add order successfully',
            order: order
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
        else if (e.message === 'Not enough') {
            res.status(401).json({
                status: false,
                errorCode: 'NOT_ENOUGH',
                message: 'Not enough',
            });
        }
        else {
            respondServerError(res);
        }
    }
});
controller.updateOrderStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Check all required fields
    if (!req.body.id || !req.body.newStatus) { // status -> TO_ACCEPT, TO_PICKUP, CANCEL, COMPLETE
        return res.status(422).json({
            status: false,
            errorCode: 'MISSING_FIELD',
            message: 'Some required field is missing'
        });
    }
    try {
        const order = yield OrderServices.updateOrderStatus(req.user.payload.id, req.body.newStatus);
        res.status(200).json({
            status: true,
            message: 'Update order status successfully',
            order: order
        });
    }
    catch (e) {
        if (e.message === 'Order not found') {
            res.status(404).json({
                status: false,
                errorCode: 'ORDER_NOT_FOUND',
                message: 'Order not found',
            });
        }
        else if (e.message === 'Cart item not found') {
            res.status(404).json({
                status: false,
                errorCode: 'CART_ITEM_NOT_FOUND',
                message: 'Cart item not found',
            });
        }
        else if (e.message === 'Reduction not found') {
            res.status(404).json({
                status: false,
                errorCode: 'REDUCTION_NOT_FOUND',
                message: 'Reduction not found',
            });
        }
        else if (e.message === 'Not enough') {
            res.status(401).json({
                status: false,
                errorCode: 'NOT_ENOUGH',
                message: 'Not enough',
            });
        }
        else {
            respondServerError(res);
        }
    }
});
module.exports = controller;
