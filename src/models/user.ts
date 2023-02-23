import { Schema, model, Document } from 'mongoose'

export interface IUser extends Document {
    email: string;
    password: string;
    name: string;
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
}, {
    timestamps: true,
    versionKey: false,
    collection
});

export const User = model<IUser>(collection, userSchema);