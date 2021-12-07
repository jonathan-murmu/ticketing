import { Request, Response, NextFunction } from 'express';

import { CustomError } from '../errors/custom-error';


export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log('Mid Err');
    if (err instanceof CustomError) {   
        console.log('Error Handler Mid!');
        return res.status(err.statusCode).send({ errors: err.serializeErrors() })
    }

    res.status(400).send({
        errors: [{ message: 'Something went wrong!' }]
    });
};