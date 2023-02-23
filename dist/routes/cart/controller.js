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
const CartServices = require('./services');
const respondServerError = require('../../helpers/respondServerError');
// TODO: All error that's using http-errors library must return as JSON instead
// TODO: All console.log must be removed and replace with logger or something better
class controller {
}
_a = controller;
controller.getCartItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Check all required fields
    if (!req.body.id) {
        return res.status(422).json({
            status: false,
            errorCode: 'MISSING_FIELD',
            message: 'Some required field is missing'
        });
    }
    try {
        const cartItem = yield CartServices.getCartItem(req.body.id);
        res.status(200).json({
            status: true,
            message: 'Get cart item successfully',
            cartItem: cartItem
        });
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
controller.getCartItemList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cartItemList = yield CartServices.getCartItemList(req.user.payload.id);
        res.status(200).json({
            status: true,
            message: 'Get cart item list successfully',
            cartItemList: cartItemList
        });
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
controller.addCartItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Check all required fields
    if (!req.body.reductionId || !req.body.amount) {
        return res.status(422).json({
            status: false,
            errorCode: 'MISSING_FIELD',
            message: 'Some required field is missing'
        });
    }
    try {
        const cartItem = yield CartServices.addItemToCart(req.user.payload.id, req.body.reductionId, req.body.amount);
        res.status(200).json({
            status: true,
            message: 'Add item to cart successfully',
            cartItem: cartItem
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
            res.status(200).json({
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
controller.updateCartItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Check all required fields
    if (!req.body.cartItemId || !req.body.amount) {
        return res.status(422).json({
            status: false,
            errorCode: 'MISSING_FIELD',
            message: 'Some required field is missing'
        });
    }
    try {
        const cartItem = yield CartServices.updateCartItem(req.user.payload.id, req.body.cartItemId, req.body.amount);
        res.status(200).json({
            status: true,
            message: 'Update cart item successfully',
            cartItem: cartItem
        });
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
controller.deleteCartItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Check all required fields
    if (!req.body.id) {
        return res.status(422).json({
            status: false,
            errorCode: 'MISSING_FIELD',
            message: 'Some required field is missing'
        });
    }
    try {
        const cartItem = yield CartServices.deleteCartItem(req.user.payload.id, req.body.id);
        res.status(200).json({
            status: true,
            message: 'Delete cart item successfully',
            cartItem: cartItem
        });
    }
    catch (e) {
        if (e.message === 'Cart item not found') {
            res.status(404).json({
                status: false,
                errorCode: 'CART_ITEM_NOT_FOUND',
                message: 'Cart item not found',
            });
        }
        else {
            respondServerError(res);
        }
    }
});
module.exports = controller;
