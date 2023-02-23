import { ConnectOptions } from 'mongodb';
import mongoose from 'mongoose';

const connectDB = async () => {
    await mongoose.connect(process.env.DATABASE_URL!);
    console.log('MongoDb Connected');   
}

module.exports = connectDB;