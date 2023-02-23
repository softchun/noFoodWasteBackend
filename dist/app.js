"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const app = (0, express_1.default)();
require('dotenv').config();
// const corsOptions = {
// 	origin: JSON.parse(process.env.ALLOWED_ORIGINS),
// 	optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
// 	credentials: true, // pass header
// };
// app.use(cors(corsOptions));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)());
//connect to db
mongoose_1.default.connect(process.env.DATABASE_URL);
const connection = mongoose_1.default.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
});
const authRouter = require('./routes/authTmp');
const userRouter = require('./routes/user');
const storeRouter = require('./routes/store');
const productRouter = require('./routes/product');
const reductionRouter = require('./routes/reduction');
const cartRouter = require('./routes/cart');
const orderRouter = require('./routes/order');
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/store', storeRouter);
app.use('/product', productRouter);
app.use('/reduction', reductionRouter);
app.use('/cart', cartRouter);
app.use('/order', orderRouter);
module.exports = app;
