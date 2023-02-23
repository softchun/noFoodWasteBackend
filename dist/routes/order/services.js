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
Object.defineProperty(exports, "__esModule", { value: true });
const cart_1 = require("../../models/cart");
const order_1 = require("../../models/order");
const reduction_1 = require("../../models/reduction");
const store_1 = require("../../models/store");
const ReductionServices = require('../reduction/services');
class services {
    static getOrder(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield order_1.Order.findOne({ _id: id }).exec();
            if (!order) {
                throw new Error("Order not found");
            }
            const store = yield store_1.Store.findOne({ _id: order.storeId }).exec();
            if (!store) {
                throw new Error("Store not found");
            }
            // let list = order.reduction
            // let reductionList = []
            // for(let i=0; i<list.length; i++) {
            //     let reduction = await ReductionServices.getReduction(list[i].id)
            //     reductionList.push({
            //         ...reduction,
            //         amount: list[i].amount
            //     })
            // }
            return {
                id: id,
                userId: order.userId,
                storeId: order.storeId,
                storeName: store.name,
                status: order.status,
                reduction: order.reduction,
            };
        });
    }
    static getOrderList(userId, storeId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = {};
            if (storeId) {
                query.storeId = storeId;
            }
            if (userId) {
                query.userId = userId;
            }
            if (status) {
                query.status = status;
            }
            let list = yield order_1.Order.find(query).exec();
            let orderList = [];
            for (let i = 0; i < list.length; i++) {
                let order = yield this.getOrder(list[i]._id);
                orderList.push(order);
            }
            return orderList;
        });
    }
    static addOrder(userId, storeId, reduction) {
        return __awaiter(this, void 0, void 0, function* () {
            let list = reduction;
            let reductionList = [];
            for (let i = 0; i < list.length; i++) {
                if (!list[i].id || !list[i].amount) {
                    throw new Error("Some required field is missing");
                }
                const reduction = yield reduction_1.Reduction.findOne({ _id: list[i].id }).exec();
                if (!reduction) {
                    throw new Error("Reduction not found");
                }
                if (reduction.stock < list[i].amount) {
                    throw new Error("Not enough");
                }
                reductionList.push({
                    id: list[i].id,
                    amount: list[i].amount
                });
            }
            const newOrder = new order_1.Order({
                userId: userId,
                storeId: storeId,
                status: 'TO_ACCEPT',
                reduction: reductionList,
            });
            yield newOrder.save();
            yield cart_1.Cart.deleteMany({ userId: userId });
            return yield order_1.Order.findOne({ _id: newOrder._id }).exec();
        });
    }
    static updateOrderStatus(id, newStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield order_1.Order.findOne({ _id: id }).exec();
            if (!order) {
                throw new Error("Order not found");
            }
            const newValues = { $set: {
                    userId: order.userId,
                    storeId: order.storeId,
                    status: newStatus,
                    reduction: order.reduction,
                } };
            const updatedOrder = yield order_1.Order.updateOne({ _id: id }, newValues);
            return updatedOrder;
        });
    }
}
module.exports = services;
