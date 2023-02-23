"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reduction = void 0;
const mongoose_1 = require("mongoose");
const collection = 'Reduction';
const reductionSchema = new mongoose_1.Schema({
    productId: {
        type: String,
        required: true,
    },
    storeId: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    expirationDate: {
        type: Date,
    },
}, {
    timestamps: true,
    versionKey: false,
    collection
});
exports.Reduction = (0, mongoose_1.model)(collection, reductionSchema);
