// Middleware to handle errors
export const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log error stack for debugging

    // Send error response
    res.status(err.status || 500).json({
        status: 'error',
        message: err.message || 'Internal Server Error',
    });
};
