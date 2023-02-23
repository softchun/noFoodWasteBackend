import { Schema, model, Document } from 'mongoose'

export interface ICart extends Document {
    userId: string;
    storeId: string;
    reductionId: string;
    amount: number;
}

const collection = 'Cart'

const cartSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    storeId: {
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

export const Cart = model<ICart>(collection, cartSchema);