import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';

// declare global {
//     namespace NodeJS {
//         interface Global {
//             signup(): Promise<string[]>
//         }
//     }
// }
declare global {
        function signup(): Promise<string[]>
}

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

global.signup = async () => {
    const email = 'test@test.com'
    const password = 'password'

    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email, password
        })
        .expect(201);
    
    const cookie = response.get('Set-Cookie');

    return cookie;
};