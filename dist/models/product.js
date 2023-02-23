"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = require("mongoose");
const collection = 'Product';
const productSchema = new mongoose_1.Schema({
    storeId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
    },
    detail: {
        type: String,
    },
}, {
    timestamps: true,
    versionKey: false,
    collection
});
exports.Product = (0, mongoose_1.model)(collection, productSchema);
