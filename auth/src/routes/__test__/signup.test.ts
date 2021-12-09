import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successfull signup', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
});

it('return a 400 with an invalid email', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test.com',
            password: 'password'
        })
        .expect(400);
});

it('return a 400 with an invalid password', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: '1'
        })
        .expect(400);
});

it('return a 400 with an missing email & password', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: '',
            password: ''
        })
        .expect(400);
});

it('disallows duplicate emails', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test1@test.com',
            password: 'password'
        })
        .expect(201);
    
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test1@test.com',
            password: 'password'
        })
        .expect(400);
});

it('sets a cookie after succesful signup', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test2@test.com',
            password: 'password'
        })
        .expect(201);
    
    expect(response.get('Set-Cookie')).toBeDefined();
});