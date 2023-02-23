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
const product_1 = require("../../models/product");
const reduction_1 = require("../../models/reduction");
const store_1 = require("../../models/store");
class services {
    static getCartItem(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const cartItem = yield cart_1.Cart.findOne({ _id: id }).exec();
            if (!cartItem) {
                throw new Error("Cart item not found");
            }
            const reduction = yield reduction_1.Reduction.findOne({ _id: cartItem.reductionId }).exec();
            if (!reduction) {
                throw new Error("Reduction not found");
            }
            const product = yield product_1.Product.findOne({ _id: reduction.productId }).exec();
            if (!product) {
                throw new Error("Product not found");
            }
            const store = yield store_1.Store.findOne({ _id: product.storeId }).exec();
            if (!store) {
                throw new Error("Store not found");
            }
            return {
                id: id,
                amount: cartItem.amount,
                reductionId: reduction.id,
                stock: reduction.stock,
                price: reduction.price,
                expirationDate: reduction.expirationDate,
                productId: reduction.productId,
                name: product.name,
                productPrice: product.price,
                detail: product.detail,
                storeId: product.storeId,
                storeName: store.name
            };
        });
    }
    static getCartItemList(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let list = yield cart_1.Cart.find({ userId: userId }).exec();
            let cartItemList = [];
            for (let i = 0; i < list.length; i++) {
                let cartItem = yield this.getCartItem(list[i]._id);
                cartItemList.push(cartItem);
            }
            return cartItemList;
        });
    }
    static addItemToCart(userId, reductionId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const cartItem = yield cart_1.Cart.findOne({ userId: userId, reductionId: reductionId }).exec();
            if (cartItem) {
                let updatedCartItem = yield this.updateCartItem(userId, cartItem._id, cartItem.amount + amount);
                return updatedCartItem;
            }
            const reduction = yield reduction_1.Reduction.findOne({ _id: reductionId }).exec();
            if (!reduction) {
                throw new Error("Reduction not found");
            }
            if (reduction.stock < amount) {
                throw new Error("Not enough");
            }
            const newCartItem = new cart_1.Cart({
                userId: userId,
                reductionId: reductionId,
                amount: amount,
            });
            yield newCartItem.save();
            return yield cart_1.Cart.findOne({ _id: newCartItem._id }).exec();
        });
    }
    static updateCartItem(userId, cartItemId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const cartItem = yield cart_1.Cart.findOne({ _id: cartItemId }).exec();
            if (!cartItem) {
                throw new Error("Cart item not found");
            }
            const reduction = yield reduction_1.Reduction.findOne({ _id: cartItem.reductionId }).exec();
            if (!reduction) {
                throw new Error("Reduction not found");
            }
            if (reduction.stock < amount) {
                throw new Error("Not enough");
            }
            const newValues = { $set: {
                    userId: userId,
                    reductionId: cartItem.reductionId,
                    amount: amount,
                } };
            const updatedCartItem = yield cart_1.Cart.updateOne({ _id: cartItemId }, newValues);
            return updatedCartItem;
        });
    }
    static deleteCartItem(userId, cartItemId) {
        return __awaiter(this, void 0, void 0, function* () {
            const cartItem = yield cart_1.Cart.findOne({ _id: cartItemId }).exec();
            if (cartItem) {
                throw new Error("Cart item not found");
            }
            const deletedCartItem = yield cart_1.Cart.deleteOne({ _id: cartItemId });
            return deletedCartItem;
        });
    }
    static deleteAllCartItem(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedCartItem = yield cart_1.Cart.deleteMany({ userId: userId });
            return deletedCartItem;
        });
    }
}
module.exports = services;
