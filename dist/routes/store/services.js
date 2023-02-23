"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const image_1 = require("../../models/image");
const store_1 = require("../../models/store");
const bcrypt = require('bcryptjs');
const myjwt = require('../../helpers/jwt');
const validateEmail = require('../../helpers/emailValidator');
// const { prettifyPhoneNumber, validatePhoneNumber } = require('../../helpers/phoneNumberUtils');
class services {
    static register(email, password, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const existUser = yield store_1.Store.findOne({ email: email }).exec();
            if (existUser === null && validatePassword(password) && validateEmail(email)) {
                const registerStore = new store_1.Store({
                    name: name,
                    email: email,
                    password: bcrypt.hashSync(password, 8),
                });
                registerStore.save();
                // return await Store.findOne({ _id: registerStore._id }).exec()
            }
            else {
                if (existUser !== null) {
                    throw new Error("This email has already registered");
                }
                else if (!validatePassword(password)) {
                    throw new Error("Password not meet requirement");
                }
                else if (!validateEmail(email)) {
                    throw new Error("Invalid email");
                }
            }
        });
    }
    static checkAccountExist(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const store = yield store_1.Store.findOne({ email }).exec();
            return store === null;
        });
    }
    static login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const store = yield store_1.Store.findOne({ email }).exec();
            if (!store) {
                throw new Error('User not found');
            }
            const checkPassword = bcrypt.compareSync(password, store.password);
            if (!checkPassword) {
                throw new Error('Wrong password');
            }
            const token = yield myjwt.signAccessToken({
                id: store._id,
                email: store.email,
                role: 'store'
            });
            return {
                email,
                token,
                role: 'store',
            };
        });
    }
    static getUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield store_1.Store.findOne({ _id: id }).exec();
            if (!user) {
                throw new Error('User not found');
            }
            return {
                id: user._id,
                email: user.email,
                name: user.name,
                role: 'store'
            };
        });
    }
    static getStore(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const store = yield store_1.Store.findOne({ _id: id }).exec();
            if (!store) {
                throw new Error('Store not found');
            }
            let profileImage = null;
            if (store.profileImage) {
                profileImage = yield image_1.Image.findOne({ _id: store.profileImage }).exec();
            }
            let coverImage = null;
            if (store.coverImage) {
                coverImage = yield image_1.Image.findOne({ _id: store.coverImage }).exec();
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
                profileImage: profileImage,
                coverImage: coverImage,
            };
        });
    }
    static getStoreList() {
        return __awaiter(this, void 0, void 0, function* () {
            const store = yield store_1.Store.find().exec();
            if (!store) {
                throw new Error('Store not found');
            }
            let storeList = [];
            let list = yield store_1.Store.find().exec();
            for (let i = 0; i < list.length; i++) {
                let store = yield this.getStore(list[i]._id);
                storeList.push(store);
            }
            return storeList;
        });
    }
}
module.exports = services;
