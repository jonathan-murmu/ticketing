import { CustomError } from "./custom-error";;

export class BadRequestError extends CustomError {
    statusCode = 400;

    constructor(public message: string) {
        super(message);
        console.log('bad reqest new', message)

        Object.setPrototypeOf(this, BadRequestError.prototype)
    }

    serializeErrors() {
        return [{message: this.message}]
    }
}