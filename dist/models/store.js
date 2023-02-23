"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Store = void 0;
const mongoose_1 = require("mongoose");
const OpenDataType = {
    open: String,
    close: String,
    isClosed: Boolean
};
const collection = 'Store';
const storeSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    isClosed: {
        type: Boolean,
        required: true,
        default: false,
    },
    detail: {
        type: String,
    },
    profileImage: {
        type: String,
    },
    coverImage: {
        type: String,
    },
    address: {
        type: String,
    },
    location: {
        lat: Number,
        lng: Number,
    },
    openTime: {
        sun: OpenDataType,
        mon: OpenDataType,
        tue: OpenDataType,
        wed: OpenDataType,
        thu: OpenDataType,
        fri: OpenDataType,
        sat: OpenDataType,
    },
}, {
    timestamps: true,
    versionKey: false,
    collection
});
exports.Store = (0, mongoose_1.model)(collection, storeSchema);
