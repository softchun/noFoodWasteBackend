import emailValidator from "../../helpers/emailValidator";
import myPasswordValidator from "../../helpers/passwordValidator";
import { Product } from "../../models/product";
import { Reduction } from "../../models/reduction";
import { IStore, Store } from "../../models/store";

const bcrypt = require('bcryptjs');
const myjwt = require('../../helpers/jwt');

const openData = {
    open: null,
    close: null,
    isClosed: false
}
const openTimeInit = {
    all: {
        ...openData,
        isAll: true,
    },
    sun: openData,
    mon: openData,
    tue: openData,
    wed: openData,
    thu: openData,
    fri: openData,
    sat: openData,
}

const locationInit = {
    lat: null,
    lng: null,
}

class services {
    static async register(
        email: string,
        password: string,
        name: string,
    ) {
        const existUser = await Store.findOne({ email: email }).exec();

        if (existUser === null && myPasswordValidator(password) && emailValidator(email)) {
            const registerStore: IStore = new Store({
                name: name,
                email: email,
                password: bcrypt.hashSync(password, 8),
                isClosed: false,
                openTime: openTimeInit,
                location: locationInit,
            });
            registerStore.save();
            // return await Store.findOne({ _id: registerStore._id }).exec()
        } else {
            if (existUser !== null) {
                throw new Error("This email has already registered")
            } else if (!myPasswordValidator(password)) {
                throw new Error("Password not meet requirement")
            } else if (!myPasswordValidator(email)) {
                throw new Error("Invalid email")
            }
        }
    }

    static async checkAccountExist(email: string) {
        const store = await Store.findOne({ email }).exec();
        return store === null;
    }

    static async login(
        email: string,
        password: string,
    ) {
        const store = await Store.findOne({ email }).exec();
        if (!store) {
            throw new Error('User not found');
        }
        const checkPassword = bcrypt.compareSync(password, store.password);
        if (!checkPassword) {
            throw new Error('Wrong password');
        }
        const token = await myjwt.signAccessToken({
            id: store._id,
            email: store.email,
            role: 'store'
        });
        return {
            email,
            token,
            role: 'store',
        }
    }
    
    static async getUser(id: string) {
        const user = await Store.findOne({ _id: id }).exec();
        if (!user) {
            throw new Error('User not found');
        }
        return {
            id: user._id,
            email: user.email,
            name: user.name,
            role: 'store'
        }
    }
    
    static async getStore(id: string) {
        const store = await Store.findOne({ _id: id }).exec();
        if (!store) {
            throw new Error('Store not found');
        }

        return {
            id: store._id,
            email: store.email,
            name: store.name,
            openTime: store.openTime,
            isClosed: store.isClosed,
            detail: store.detail,
            address: store.address,
            location: store.location,
            profileImage: store.profileImage,
            coverImage: store.coverImage,
        }
    }
    
    static async getStoreList(
        keyword: string,
        skip?: number,
        limit?: number,
        sort?: number,
    ) {
        const store = await Store.find().exec();
        if (!store) {
            throw new Error('Store not found');
        }

        let storeList = []
        let query: any = {}
        if (!!keyword) {
            query.$or = [
                {name: { $regex: keyword, $options: 'i' }},
                {detail: { $regex: keyword, $options: 'i' }},
                {address: { $regex: keyword, $options: 'i' }},
            ]
        }
        
        let options: any = {
            sort: { _id: sort || -1 },
            skip: skip || 0,
        }
        if (limit) {
            options.limit = limit
        }

        let list = await Store.find(query, undefined, options).exec();

        for(let i=0; i<list.length; i++) {
            let store = await this.getStore(list[i]._id)
            storeList.push(store)
        }
        
        return storeList
    }
        
    static async updateStore(
        storeId: string,
        name: string,
        openTime: any,
        isClosed: boolean,
        detail: string,
        address: string,
        location: any,
        profileImage: string,
        coverImage: string,
    ) {
        const store = await Store.findOne({ _id: storeId }).exec();

        if (!store) {
            throw new Error("Store not found")
        }

        const newValues = {$set: {
            name: name || store.name,
            openTime: openTime || store.openTime,
            isClosed: isClosed || store.isClosed,
            detail: detail || store.detail,
            address: address || store.address,
            location: location || locationInit,
            profileImage: profileImage || store.profileImage,
            coverImage: coverImage || store.coverImage,
        }}
        const updatedStore = await Store.updateOne({ _id: storeId }, newValues);

        return updatedStore
    }
    
    static async deleteStore(
        storeId: string,
    ) {
        const store = await Store.findOne({ _id: storeId }).exec();

        if (!store) {
            throw new Error("Store not found")
        }

        const reductions = await Reduction.deleteMany({ storeId: storeId });
        const product = await Product.deleteMany({ storeId: storeId });
        const deletedStore = await Store.deleteOne({ _id: storeId });

        return deletedStore
    }
}

module.exports = services