/**
 * Custom error class representing application errors.
 * @class AppError
 * @extends Error
 * @param {string} message - Error message.
 * @param {number} statusCode - HTTP status code associated with the error.
 
This AppError class is designed to handle application-specific errors.
It extends the built-in Error class and adds a statusCode property 
to represent the HTTP status code associated with the error. 
This can be useful for handling errors in web applications
where different HTTP status codes signify different types of errors.

*/


export class AppError extends Error {

    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
