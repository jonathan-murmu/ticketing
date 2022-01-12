import mongoose from 'mongoose';

import { app } from './app';
import { natsWrapper } from './nats-wrapper';

const start = async () => {
    console.log('process.env.JWT_KEY start', process.env.JWT_KEY)
    if(!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined!')
    }
    if(!process.env.MONGO_URI) {
        throw new Error('MONGO_URI must be defined!')
    }
    if(!process.env.NATS_CLIENT_ID) {
        throw new Error('NATS_CLIENT_ID must be defined!')
    }
    if(!process.env.NATS_URL) {
        throw new Error('NATS_URL must be defined!')
    }
    if(!process.env.NATS_CLUSTER_ID) {
        throw new Error('NATS_CLUSTER_ID must be defined!')
    }

    try {
        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID,
            process.env.NATS_CLIENT_ID,
            process.env.NATS_URL
        )

        natsWrapper.client.on('close', () => {
            console.log('Nats connection closed');
            process.exit();
        })

        // graceful shutdown
        process.on('SIGINT', () => natsWrapper.client.close()); // INTERRUPT
        process.on('SIGTERM', () => natsWrapper.client.close())  // TERMINATE


        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to Orders Mongo DB!')
    } catch(err) {
        console.log(err)
    }

    app.listen(3000, () => {
        console.log('Listening on port 3000 - Orders Service!')
    });
}

start();

