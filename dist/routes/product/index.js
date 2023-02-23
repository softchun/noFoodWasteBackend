"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const product = require('./controller');
const auth = require('../store/auth');
const multerUploadMiddleware = require('../../helpers/multerMiddleware');
// const multerMiddleware = require("../../services/multerMiddleware");
router.get('/', auth, product.getProduct);
router.get('/all', auth, product.getProductList);
router.post('/add', auth, multerUploadMiddleware.single('image'), product.addProduct);
router.post('/update', auth, multerUploadMiddleware.single('image'), product.updateProduct);
router.post('/delete', auth, product.deleteProduct);
// router.get('/setting/profile', auth, profile.getProfile);
// router.post('/setting/profile/change-profile-pic', auth, multerMiddleware.single('image'), profile.changeProfilePic);
module.exports = router;
