class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.message = err.message || "Internal server error.";

    if (err.name === "CastError") {
        message = `Invalid ${err.path}`;
        statusCode = 400;
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue).join(", ");
        message = `Duplicate field value entered: ${field}`;
        statusCode = 400;
    }

    if (err.name === "JsonWebTokenError") {
        message = "JSON Web Token is invalid, Try again";
        statusCode = 401;
    }

    if (err.name === "TokenExpiredError") {
        message = "JSON Web Token has expired, Try again";
        statusCode = 401;
    }

    if (err.name === "ValidationError") {
        message = Object.values(err.errors)
            .map(val => val.message)
            .join(", ");
        statusCode = 400;
    }

    return res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};

export default ErrorHandler;