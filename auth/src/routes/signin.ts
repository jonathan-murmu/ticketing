import express, { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError } from '@ticketsjm92/common';

import { User } from '../models/user';
import { Password } from '../services/password';


const router = express.Router();

router.post('/api/users/signin',[
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('You must supply a password')
], 
validateRequest,
async (req: Request, res: Response, next: NextFunction) => {
    try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        console.log('email not exisit!')
        throw new BadRequestError('Invalied Credentials!');
    }

    const passwordMatch = await Password.compare(
        existingUser.password, password
    );
    if (!passwordMatch) {
        console.log('passs mismatch')
        throw new BadRequestError('Invalied Credentials!');
    }

    // Generate json web token
    const userJwt = jwt.sign({
        id: existingUser.id,
        email: existingUser.email
    },
    process.env.JWT_KEY!  // saying typescript its already defined.
    );

    // store jwt on the session obj
    req.session = {
        jwt: userJwt
    };

    res.status(200).send(existingUser)
    } catch(err) {
        next(err);
    }
});

export { router as signinRouter}