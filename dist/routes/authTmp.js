var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const jsonParser = bodyParser.json();
router.get('/', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield User.find();
        res.send(user);
    });
});
router.post('/login', jsonParser, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(200).send({
                message: 'Please try again'
            });
        }
        const user = yield User.findOne({ email }).exec();
        if (user) {
            bcrypt.compare(password, user.password, function (err, result) {
                if (result) {
                    const payload = {
                        "_id": user._id,
                        "email": user.email,
                        "name": user.name
                    };
                    jwt.sign(payload, process.env.TOKEN_KEY, { expiresIn: "48h" }, (err, token) => {
                        res.json({
                            email: user.email,
                            role: "customer",
                            token: token
                        });
                    });
                }
                else {
                    res.status(200).send({
                        message: 'Username or Password incorrect!'
                    });
                }
            });
        }
        else {
            res.status(200).send({
                message: 'Username does not exist.'
            });
        }
    });
});
router.post('/register', jsonParser, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            res.status(200).send({
                message: 'Please try again'
            });
        }
        const user1 = yield User.findOne({ email }).exec();
        if (user1) {
            res.status(200).send({
                message: 'This email already use, please login.'
            });
        }
        // const user2 = await User.findOne({ username }).exec();
        // if (user2) {
        //     res.status(200).send({
        //         message: 'This username already use, please change.'
        //     });
        // }
        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, function (err, hash) {
            const user = new User({
                name,
                email,
                password: hash,
                favReduction: [],
                favStore: [],
            });
            user.save();
        });
        res.send('Successful register!');
    });
});
module.exports = router;
