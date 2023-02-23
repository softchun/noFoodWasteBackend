"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const user = require('./controller');
const auth = require('../auth');
const authUser = require('./auth');
router.get('/', authUser, user.getUser);
router.post('/register', user.register);
router.post('/check-account-exist', user.checkAccountExist);
router.post('/login', user.login);
router.post('/logout', user.logout);
router.get('/check-verified', auth, user.checkVerified);
// router.get('/setting/profile', auth, profile.getProfile);
// router.post('/setting/profile/change-profile-pic', auth, multerMiddleware.single('image'), profile.changeProfilePic);
module.exports = router;
