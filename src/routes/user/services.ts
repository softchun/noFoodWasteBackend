import emailValidator from "../../helpers/emailValidator";
import myPasswordValidator from "../../helpers/passwordValidator";
import { IUser, User } from "../../models/user";

const bcrypt = require('bcryptjs');
const myjwt = require('../../helpers/jwt');

class services {
    static async register(
        email: string,
        password: string,
        name: string,
    ) {
        const existUser = await User.findOne({ email: email }).exec();

        if (existUser === null && myPasswordValidator(password) && emailValidator(email)) {
            const registerUser: IUser = new User({
                name: name,
                email: email,
                password: bcrypt.hashSync(password, 8),
                cancelHistory: [],
            });
            registerUser.save();
            // return await User.findOne({ _id: registerUser._id }).exec()
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
        const user = await User.findOne({ email }).exec();
        return user === null;
    }

    static async login(
        email: string,
        password: string,
    ) {
        const user = await User.findOne({ email }).exec();
        if (!user) {
            throw new Error('User not found');
        }
        const checkPassword = bcrypt.compareSync(password, user.password);
        if (!checkPassword) {
            throw new Error('Wrong password');
        }
        delete user.password;
        const token = await myjwt.signAccessToken({
            id: user._id,
            email: user.email,
            role: 'customer'
        });
        return {
            email,
            token,
            role: 'customer'
        }
    }
    
    static async getUser(id: string) {
        const user = await User.findOne({ _id: id }).exec();
        if (!user) {
            throw new Error('User not found');
        }
        return {
            id: user._id,
            email: user.email,
            name: user.name,
            role: 'customer'
        }
    }
}

module.exports = services