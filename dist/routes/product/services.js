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
const image_1 = require("../../models/image");
const product_1 = require("../../models/product");
const reduction_1 = require("../../models/reduction");
const ImageServices = require('../image/services');
class services {
    static getProduct(storeId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield product_1.Product.findOne({ _id: id }).exec();
            if (!product || product.storeId !== storeId) {
                throw new Error("Product not found");
            }
            const reductions = yield reduction_1.Reduction.find({ productId: product._id }).exec();
            let image = null;
            if (product.image) {
                image = yield image_1.Image.findOne({ _id: product.image }).exec();
            }
            return {
                id: product._id,
                storeId: product.storeId,
                name: product.name,
                price: product.price,
                detail: product.detail,
                image: image,
                reductions: reductions
            };
        });
    }
    static getProductList(storeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const list = yield product_1.Product.find({ storeId }).exec();
            let productList = [];
            for (let i = 0; i < list.length; i++) {
                let product = yield this.getProduct(list[i]._id, storeId);
                productList.push(product);
            }
            return productList;
        });
    }
    static addProduct(storeId, name, price, detail, image) {
        return __awaiter(this, void 0, void 0, function* () {
            let productImage = null;
            if (image) {
                let imageName = 'product-' + name;
                productImage = yield ImageServices.addImage(image, imageName);
            }
            const product = new product_1.Product({
                storeId: storeId,
                name: name,
                price: price,
                image: productImage === null || productImage === void 0 ? void 0 : productImage._id,
                detail: detail,
            });
            yield product.save();
            return yield product_1.Product.findOne({ _id: product._id }).exec();
        });
    }
    static updateProduct(storeId, id, name, price, detail, image) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield product_1.Product.findOne({ _id: id }).exec();
            if (!product || product.storeId !== storeId) {
                throw new Error("Product not found");
            }
            let productImage = null;
            if (image) {
                if (product.image) {
                    yield ImageServices.deletedImage(image);
                }
                let imageName = 'product-' + name;
                productImage = yield ImageServices.addImage(image, imageName);
            }
            const newValues = { $set: {
                    name: name || product.name,
                    price: price || product.price,
                    image: productImage ? productImage._id : product.image,
                    detail: detail || product.detail,
                } };
            const updatedProduct = yield product_1.Product.updateOne({ _id: id }, newValues);
            return updatedProduct;
        });
    }
    static deleteProduct(storeId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield product_1.Product.findOne({ _id: id }).exec();
            if (!product || product.storeId !== storeId) {
                throw new Error("Product not found");
            }
            const reductions = yield reduction_1.Reduction.deleteMany({ productId: id });
            const deletedProduct = yield product_1.Product.deleteOne({ _id: id });
            return deletedProduct;
        });
    }
}
module.exports = services;
