import { Schema, model, Document } from 'mongoose'

type ItemData = {
    id: string,
    productId: string,
    storeId: string,
    name: string,
    price: number,
    productPrice: number,
    amount: number,
    image: string,
    detail: string,
    expirationDate: Date,
    bestBeforeDate: Date;
}
export interface IOrder extends Document {
    userId: string;
    storeId: string;
    storeName: string;
    status: string;     // status -> TO_ACCEPT, TO_PICKUP, CANCELED, COMPLETE
    reduction: ItemData[];
    lastUpdate: Date;
}

const collection = 'Order'

const orderSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    storeId: {
        type: String,
        required: true,
    },
    storeName: {
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
    lastUpdate: {
        type: Date,
        required: true,
    }
}, {
    timestamps: true,
    versionKey: false,
    collection
});

export const Order = model<IOrder>(collection, orderSchema);