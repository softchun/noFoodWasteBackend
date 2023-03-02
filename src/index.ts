import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import {json} from 'body-parser'
import mongoose from 'mongoose'

const app = express()

require('dotenv').config();

// const corsOptions = {
// 	origin: JSON.parse(process.env.ALLOWED_ORIGINS),
// 	optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
// 	credentials: true, // pass header
// };

// app.use(cors(corsOptions));


app.use(express.json());
app.use(cookieParser());
app.use(cors());

//connect to db
mongoose.connect(process.env.DATABASE_URL);

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})

const authRouter = require('./routes/auth');
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

// module.exports = app;

// const http = require("http");
// const server = http.createServer(app);

const port = process.env.PORT || '3000'

const server = app.listen(port, () => {
    console.log('start on port', port)
})
process.on("unhandledRejection",(error,promise)=>{
    console.log(`Logged Error: ${error}`);
    server.close(()=>process.exit(1))

})