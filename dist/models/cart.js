"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cart = void 0;
const mongoose_1 = require("mongoose");
const collection = 'Cart';
const cartSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: true,
    },
    reductionId: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
    versionKey: false,
    collection
});
exports.Cart = (0, mongoose_1.model)(collection, cartSchema);
