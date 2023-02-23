import { Schema, model, Document } from 'mongoose'

type OpenData = {
    open: string,
    close: string,
    isClosed: boolean
}

const OpenDataType = {
    open: String,
    close: String,
    isClosed: Boolean
}

export interface IStore extends Document {
    email: string;
    password: string;
    name: string;
    isClosed: boolean;
    detail: string;
    profileImage: string;
    coverImage: string;
    address: string;
    location: {
        lat: number;
        lng: number;
    };
    openTime: {
        all: {
            open: string;
            close: string;
            isClosed: boolean;
            isAll: boolean;
        };
        sun: OpenData;
        mon: OpenData;
        tue: OpenData;
        wed: OpenData;
        thu: OpenData;
        fri: OpenData;
        sat: OpenData;
    };
}

const collection = 'Store'

const storeSchema = new Schema({
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
        all: {
            ...OpenDataType,
            isAll: Boolean,
        },
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

export const Store = model<IStore>(collection, storeSchema);