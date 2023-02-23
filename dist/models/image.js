"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Image = void 0;
const mongoose_1 = require("mongoose");
const collection = 'Image';
const imageSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    img: {
        dataImg: Buffer,
        contentType: String
    },
}, {
    timestamps: true,
    versionKey: false,
    collection
});
exports.Image = (0, mongoose_1.model)(collection, imageSchema);
