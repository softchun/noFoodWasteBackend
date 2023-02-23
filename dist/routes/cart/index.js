"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const cart = require('./controller');
const auth = require('../user/auth');
// const multerMiddleware = require("../../services/multerMiddleware");
router.get('/', auth, cart.getCartItemList);
router.post('/add', auth, cart.addCartItem);
router.post('/update', auth, cart.updateCartItem);
router.post('/delete', auth, cart.deleteCartItem);
// router.get('/setting/profile', auth, profile.getProfile);
// router.post('/setting/profile/change-profile-pic', auth, multerMiddleware.single('image'), profile.changeProfilePic);
module.exports = router;
