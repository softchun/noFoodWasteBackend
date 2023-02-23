import { Response } from "express";

const OrderServices = require('./services')
const respondServerError = require('../../helpers/respondServerError');

// TODO: All error that's using http-errors library must return as JSON instead
// TODO: All console.log must be removed and replace with logger or something better
class controller {
    static getOrder = async (req: any, res: Response, next: any) => {
        // Check all required fields
        if (!req.body.id) {
            return res.status(422).json({
                status: false,
                errorCode: 'MISSING_FIELD',
                message: 'Some required field is missing'
            })
        }
        try {
            const order = await OrderServices.getOrder(req.body.id);
            res.status(200).json({
                status: true,
                message: 'Get order successfully',
                order: order
            })
        } catch (e) {
            if (e.message === 'Order not found') {
                res.status(404).json({
                    status: false,
                    errorCode: 'ORDER_NOT_FOUND',
                    message: 'Order not found',
                })
            } else if (e.message === 'Store not found') {
                res.status(404).json({
                    status: false,
                    errorCode: 'STORE_NOT_FOUND',
                    message: 'Store not found',
                })
            } else if (e.message === 'Cart item not found') {
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
    
    static getOrderList = async (req: any, res: Response, next: any) => {
        try {
            if (req.user.payload.role === 'customer') {
                const orderList = await OrderServices.getOrderList(req.user.payload.id, null, req.body.status);
                res.status(200).json({
                    status: true,
                    message: 'Get order list successfully',
                    orderList: orderList
                })
            } else {
                const orderList = await OrderServices.getOrderList(null, req.user.payload.id, req.body.status);
                res.status(200).json({
                    status: true,
                    message: 'Get order list successfully',
                    orderList: orderList
                })
            }
            
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

    static addOrder = async (req: any, res: Response, next: any) => {
        // Check all required fields
        if (!req.body.reduction || !req.body.storeId) {
            return res.status(422).json({
                status: false,
                errorCode: 'MISSING_FIELD',
                message: 'Some required field is missing'
            })
        }
        try {
            const order = await OrderServices.addOrder(
                req.user.payload.id,
                req.body.storeId,
                req.body.reduction,
            );
            res.status(200).json({
                status: true,
                message: 'Add order successfully',
                order: order
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
            } else if (e.message === 'Store not found') {
                res.status(404).json({
                    status: false,
                    errorCode: 'STORE_NOT_FOUND',
                    message: 'Store not found',
                })
            } else if (e.message === 'Products are not same store') {
                res.status(401).json({
                    status: false,
                    errorCode: 'PRODUCT_NOT_SAME_STORE',
                    message: 'Products are not same store',
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

    static updateOrderStatus = async (req: any, res: Response, next: any) => {
        // Check all required fields
        if (!req.body.id || !req.body.newStatus) { // status -> TO_ACCEPT, TO_PICKUP, CANCEL, COMPLETE
            return res.status(422).json({
                status: false,
                errorCode: 'MISSING_FIELD',
                message: 'Some required field is missing'
            })
        }
        try {
            const order = await OrderServices.updateOrderStatus(req.user.payload.id, req.body.newStatus);
            res.status(200).json({
                status: true,
                message: 'Update order status successfully',
                order: order
            })
        } catch (e) {
            if (e.message === 'Order not found') {
                res.status(404).json({
                    status: false,
                    errorCode: 'ORDER_NOT_FOUND',
                    message: 'Order not found',
                })
            } else if (e.message === 'Cart item not found') {
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
}

module.exports = controller;