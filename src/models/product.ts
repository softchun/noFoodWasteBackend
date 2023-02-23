import { Schema, model, Document } from 'mongoose'

export interface IProduct extends Document {
    storeId: string;
    name: string;
    price: number;
    image: string;
    detail: string;
}

const collection = 'Product'

const productSchema = new Schema({
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

export const Product = model<IProduct>(collection, productSchema);