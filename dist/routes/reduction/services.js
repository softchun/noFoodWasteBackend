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
const image_1 = require("../../models/image");
const product_1 = require("../../models/product");
const reduction_1 = require("../../models/reduction");
const store_1 = require("../../models/store");
class services {
    static getReduction(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const reduction = yield reduction_1.Reduction.findOne({ _id: id }).exec();
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
            let image = null;
            if (product.image) {
                image = yield image_1.Image.findOne({ _id: product.image }).exec();
            }
            return {
                id: reduction.id,
                stock: reduction.stock,
                price: reduction.price,
                expirationDate: reduction.expirationDate,
                productId: reduction.productId,
                name: product.name,
                productPrice: product.price,
                detail: product.detail,
                image: image,
                storeId: product.storeId,
                storeName: store.name
            };
        });
    }
    static getReductionList(storeId) {
        return __awaiter(this, void 0, void 0, function* () {
            let list = null;
            let reductionList = [];
            if (storeId) {
                list = yield reduction_1.Reduction.find({ storeId: storeId }).exec();
            }
            else {
                list = yield reduction_1.Reduction.find().exec();
            }
            for (let i = 0; i < list.length; i++) {
                let reduction = yield this.getReduction(list[i]._id);
                reductionList.push(reduction);
            }
            return reductionList;
        });
    }
    static addReduction(storeId, productId, stock, price, expirationDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield product_1.Product.findOne({ _id: productId }).exec();
            if (!product || product.storeId !== storeId) {
                throw new Error("Product not found");
            }
            const reduction = new reduction_1.Reduction({
                productId: productId,
                storeId: product.storeId,
                stock: stock,
                price: price,
                expirationDate: expirationDate,
            });
            yield reduction.save();
            return yield reduction_1.Reduction.findOne({ _id: reduction._id }).exec();
        });
    }
    static updateReduction(storeId, id, productId, stock, price, expirationDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const reduction = yield reduction_1.Reduction.findOne({ _id: id }).exec();
            if (!reduction) {
                throw new Error("Reduction not found");
            }
            const product = yield product_1.Product.findOne({ _id: productId || reduction.productId }).exec();
            if (!product || product.storeId !== storeId) {
                throw new Error("Product not found");
            }
            const newValues = { $set: {
                    productId: productId || reduction.productId,
                    storeId: product.storeId,
                    stock: stock || reduction.stock,
                    price: price || reduction.price,
                    expirationDate: expirationDate || reduction.expirationDate,
                } };
            const updatedReduction = yield reduction_1.Reduction.updateOne({ _id: id }, newValues);
            return updatedReduction;
        });
    }
    static deleteReduction(storeId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const reduction = yield reduction_1.Reduction.findOne({ _id: id }).exec();
            if (!reduction) {
                throw new Error("Reduction not found");
            }
            const product = yield product_1.Product.findOne({ _id: reduction.productId }).exec();
            if (!product || product.storeId !== storeId) {
                throw new Error("Product not found");
            }
            const cartItem = yield cart_1.Cart.deleteMany({ reductionId: id });
            const deletedReduction = yield reduction_1.Reduction.deleteOne({ _id: id });
            return deletedReduction;
        });
    }
}
module.exports = services;
