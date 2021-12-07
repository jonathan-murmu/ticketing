import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

import { User } from '../models/user';
import { RequestValidationError } from '../errors/request-validation-error';
import { BadRequestError } from '../errors/bad-request-errors';
import { validateRequest } from '../middlewares/validate-request';


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
    async (req: Request, res: Response) => {

        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new BadRequestError('Email in use BadRequest!');
        }

        console.log('email check done')

        const user = User.build({ email, password });
        await user.save();
        console.log('user saved');

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
    }
);

export { router as signupRouter}