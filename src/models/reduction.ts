import { Schema, model, Document } from 'mongoose'

export interface IReduction extends Document {
    productId: string;
    storeId: string;
    stock: number;
    price: number;
    expirationDate: Date;
    bestBeforeDate: Date;
}

const collection = 'Reduction'

const reductionSchema = new Schema({
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
    bestBeforeDate: {
        type: Date,
    },
}, {
    timestamps: true,
    versionKey: false,
    collection
});

export const Reduction = model<IReduction>(collection, reductionSchema);