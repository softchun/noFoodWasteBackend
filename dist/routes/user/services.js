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
const user_1 = require("../../models/user");
const bcrypt = require('bcryptjs');
const myjwt = require('../../helpers/jwt');
const validateEmail = require('../../helpers/emailValidator');
class services {
    static register(email, password, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const existUser = yield user_1.User.findOne({ email: email }).exec();
            if (existUser === null && validatePassword(password) && validateEmail(email)) {
                const registerUser = new user_1.User({
                    name: name,
                    email: email,
                    password: bcrypt.hashSync(password, 8),
                    favReduction: [],
                    favStore: [],
                });
                registerUser.save();
                // return await User.findOne({ _id: registerUser._id }).exec()
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
            const user = yield user_1.User.findOne({ email }).exec();
            return user === null;
        });
    }
    static login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_1.User.findOne({ email }).exec();
            if (!user) {
                throw new Error('User not found');
            }
            const checkPassword = bcrypt.compareSync(password, user.password);
            if (!checkPassword) {
                throw new Error('Wrong password');
            }
            delete user.password;
            const token = yield myjwt.signAccessToken({
                id: user._id,
                email: user.email,
                role: 'customer'
            });
            return {
                email,
                token,
                role: 'customer'
            };
        });
    }
    static getUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_1.User.findOne({ _id: id }).exec();
            if (!user) {
                throw new Error('User not found');
            }
            return {
                id: user._id,
                email: user.email,
                name: user.name,
                role: 'customer'
            };
        });
    }
}
module.exports = services;
