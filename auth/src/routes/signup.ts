import express, { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError } from '@ticketsjm92/common';

import { User } from '../models/user';


const router = express.Router();

router.post('/api/users/signup',[
        body('email')
            .isEmail()
            .withMessage('Email must be valid'),
        body('password')
            .trim()
            .isLength( {min:4, max:20} )
            .withMessage('Password must be between 4 and 20 characters')
    ],
    validateRequest,
    async (req: Request, res: Response, next: NextFunction) => {
        try{
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new BadRequestError('Email in use!');
        }

        const user = User.build({ email, password });
        await user.save();

        // Generate json web token
        const userJwt = jwt.sign({
            id: user.id,
            email: user.email
        },
        process.env.JWT_KEY!  // saying typescript its already defined.
        );

        // store jwt on the session obj
        req.session = {
            jwt: userJwt
        };

        res.status(201).send(user);
        } catch(err) {
            next(err);
        }
    }
);

export { router as signupRouter}