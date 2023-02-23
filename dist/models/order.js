"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = require("mongoose");
const collection = 'Order';
const orderSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: true,
    },
    storeId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    reduction: {
        type: Array,
        required: true,
    },
}, {
    timestamps: true,
    versionKey: false,
    collection
});
exports.Order = (0, mongoose_1.model)(collection, orderSchema);
