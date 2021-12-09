import request from 'supertest';
import { app } from '../../app';

it('returns a 400 is email does not exist', async () => {
    return request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(400);
});

it('return a 400 when incorrect password' , async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);

    return request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'wrong-password'
        })
        .expect(400);
    
});