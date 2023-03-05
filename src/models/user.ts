import { Schema, model, Document } from 'mongoose'

type CancelHistoryData = {
    date: Date,
    cancelBy: string,   // customer, store
}

export interface IUser extends Document {
    email: string;
    password: string;
    name: string;
    cancelHistory: CancelHistoryData[];
}

const collection = 'User'

const userSchema = new Schema({
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
    cancelHistory: {
        type: Array,
        required: true,
    },
}, {
    timestamps: true,
    versionKey: false,
    collection
});

export const User = model<IUser>(collection, userSchema);