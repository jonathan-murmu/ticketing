import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';
import jwt from 'jsonwebtoken';

// declare global {
//     namespace NodeJS {
//         interface Global {
//             signup(): Promise<string[]>
//         }
//     }
// }
declare global {
        function signin(): string[]
}
jest.setTimeout(30000);
jest.mock('../nats-wrapper');

let mongo: any;
// hook that run before any test
beforeAll(async () => {
    process.env.JWT_KEY = 'asdf';
    jest.setTimeout(30000);

    mongo = new MongoMemoryServer();
    await mongo.start();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri);
});

// hook that run before each test
beforeEach(async () => {
    jest.clearAllMocks();
    jest.setTimeout(30000);
    const collections = await mongoose.connection.db.collections();

    for(let collection of collections){
        await collection.deleteMany({});
    }
});

afterAll(async() => {
    jest.setTimeout(30000);
    await mongo.stop();
    await mongoose.connection.close();
});

global.signin = () => {
    jest.setTimeout(30000);
    // Build a jwt payload {id, email}
    const payload = {
        id: new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com'
    };
    // Create the jwt
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    // Build the session object { jwt: My-jwt}
    const session = { jwt: token };

    // turn that sessio into json
    const sessionJSON = JSON.stringify(session);
    
    // take json and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64');

    // return a string thats the cookiee a
    return [`express:sess=${base64}`];
    
};