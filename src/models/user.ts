import { Schema, model, Document } from 'mongoose'

type CancelHistotyData = {
    date: Date,
    cancelBy: string,   // customer, store
}

export interface IUser extends Document {
    email: string;
    password: string;
    name: string;
    cancelHistoty: CancelHistotyData[];
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
    cancelHistoty: {
        type: Array,
        required: true,
    },
}, {
    timestamps: true,
    versionKey: false,
    collection
});

export const User = model<IUser>(collection, userSchema);