import mongoose from 'mongoose';

import { app } from './app';

const start = async () => {
    console.log('process.env.JWT_KEY start', process.env.JWT_KEY)
    if(!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined!')
    }
    if(!process.env.MONGO_URI) {
        throw new Error('JWT_KEY must be defined!')
    }
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to Auth Mongo DB!')
    } catch(err) {
        console.log(err)
    }

    app.listen(3000, () => {
        console.log('Listening on port 3000 - Auth Service!')
    });
}

start();

