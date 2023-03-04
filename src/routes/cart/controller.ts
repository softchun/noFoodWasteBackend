import { Response } from "express";

const CartServices = require('./services')
const respondServerError = require('../../helpers/respondServerError');

// TODO: All error that's using http-errors library must return as JSON instead
// TODO: All console.log must be removed and replace with logger or something better
class controller {
    static getCartItem = async (req: any, res: Response, next: any) => {
        // Check all required fields
        if (!req.body.id) {
            return res.status(422).json({
                status: false,
                errorCode: 'MISSING_FIELD',
                message: 'Some required field is missing'
            })
        }
        try {
            const cartItem = await CartServices.getCartItem(req.user.payload.id, req.body.id);
            res.status(200).json({
                status: true,
                message: 'Get cart item successfully',
                cartItem: cartItem
            })
        } catch (e) {
            if (e.message === 'Cart item not found') {
                res.status(404).json({
                    status: false,
                    errorCode: 'CART_ITEM_NOT_FOUND',
                    message: 'Cart item not found',
                })
            } else if (e.message === 'Reduction not found') {
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
    
    static getCartItemList = async (req: any, res: Response, next: any) => {
        try {
            const cartItemList = await CartServices.getCartItemList(req.user.payload.id);
            res.status(200).json({
                status: true,
                message: 'Get cart item list successfully',
                cartItemList: cartItemList
            })
        } catch (e) {
            if (e.message === 'Cart item not found') {
                res.status(404).json({
                    status: false,
                    errorCode: 'CART_ITEM_NOT_FOUND',
                    message: 'Cart item not found',
                })
            } else if (e.message === 'Reduction not found') {
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
    
    static checkItemSameStore = async (req: any, res: Response, next: any) => {
        // Check all required fields
        if (!req.body.reductionId) {
            return res.status(422).json({
                status: false,
                errorCode: 'MISSING_FIELD',
                message: 'Some required field is missing'
            })
        }
        try {
            const isSameStore = await CartServices.checkItemSameStore(req.user.payload.id, req.body.reductionId);
            res.status(200).json({
                status: true,
                message: isSameStore ? 'Can be add to cart' : 'Reduction is not same store to previous item',
                isSameStore: isSameStore
            })
        } catch (e) {
            if (e.message === 'Reduction not found') {
                res.status(404).json({
                    status: false,
                    errorCode: 'REDUCTION_NOT_FOUND',
                    message: 'Reduction not found',
                })
            } else if (e.message === 'Not enough') {
                res.status(200).json({
                    status: false,
                    errorCode: 'NOT_ENOUGH',
                    message: 'Not enough',
                })
            } else {
                respondServerError(res);
            }
        }
    }

    static addCartItem = async (req: any, res: Response, next: any) => {
        // Check all required fields
        if (!req.body.reductionId || !req.body.amount) {
            return res.status(422).json({
                status: false,
                errorCode: 'MISSING_FIELD',
                message: 'Some required field is missing'
            })
        }
        try {
            const cartItem = await CartServices.addItemToCart(req.user.payload.id, req.body.reductionId, req.body.amount);
            res.status(200).json({
                status: true,
                message: 'Add item to cart successfully',
                cartItem: cartItem
            })
        } catch (e) {
            if (e.message === 'Reduction not found') {
                res.status(404).json({
                    status: false,
                    errorCode: 'REDUCTION_NOT_FOUND',
                    message: 'Reduction not found',
                })
            } else if (e.message === 'Not enough') {
                res.status(200).json({
                    status: false,
                    errorCode: 'NOT_ENOUGH',
                    message: 'Not enough',
                })
            } else {
                respondServerError(res);
            }
        }
    }

    static updateCartItem = async (req: any, res: Response, next: any) => {
        // Check all required fields
        if (!req.body.cartItemId || (!req.body.amount && req.body.amount !== 0)) {
            return res.status(422).json({
                status: false,
                errorCode: 'MISSING_FIELD',
                message: 'Some required field is missing'
            })
        }
        try {
            const cartItem = await CartServices.updateCartItem(
                req.user.payload.id,
                req.body.cartItemId,
                req.body.amount,
            );
            res.status(200).json({
                status: true,
                message: 'Update cart item successfully',
                cartItem: cartItem
            })
        } catch (e) {
            if (e.message === 'Cart item not found') {
                res.status(404).json({
                    status: false,
                    errorCode: 'CART_ITEM_NOT_FOUND',
                    message: 'Cart item not found',
                })
            } else if (e.message === 'Reduction not found') {
                res.status(404).json({
                    status: false,
                    errorCode: 'REDUCTION_NOT_FOUND',
                    message: 'Reduction not found',
                })
            } else if (e.message === 'Not enough') {
                res.status(401).json({
                    status: false,
                    errorCode: 'NOT_ENOUGH',
                    message: 'Not enough',
                })
            } else {
                respondServerError(res);
            }
        }
    }

    static deleteCartItem = async (req: any, res: Response, next: any) => {
        // Check all required fields
        if (!req.body.id) {
            return res.status(422).json({
                status: false,
                errorCode: 'MISSING_FIELD',
                message: 'Some required field is missing'
            })
        }
        try {
            const cartItem = await CartServices.deleteCartItem(req.user.payload.id, req.body.id);
            res.status(200).json({
                status: true,
                message: 'Delete cart item successfully',
                cartItem: cartItem
            })
        } catch (e) {
            if (e.message === 'Cart item not found') {
                res.status(404).json({
                    status: false,
                    errorCode: 'CART_ITEM_NOT_FOUND',
                    message: 'Cart item not found',
                })
            } else {
                respondServerError(res);
            }
        }
    }
}

module.exports = controller;