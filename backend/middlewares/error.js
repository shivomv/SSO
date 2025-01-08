const ErrorHandler = require("./../utils/ErrorHandler");

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

// Wrong mongodb ID  -- CastError
if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;    
    err = new ErrorHandler(message, 400);
}

// Duplicate key error
if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
}

// Wrong JWT error
if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, Try again`;
    err = new ErrorHandler(message, 400);
}

// JWT expired
if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is expired, Try again`;
    err = new ErrorHandler(message, 400);
}


    res.status(err.statusCode).json({
        success: false,
        statusCode: err.statusCode,
        message: err.message
    });
};
