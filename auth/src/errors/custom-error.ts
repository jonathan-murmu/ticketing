export abstract class CustomError extends Error {
    abstract statusCode: number;

    constructor(message: string) {
        console.log('cust error class constructor')
        super(message);
        Object.setPrototypeOf(this, CustomError.prototype)
    }

    abstract serializeErrors(): { message: string; field?: string }[];
}