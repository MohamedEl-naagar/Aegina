




export const globalError = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    if (process.env.MODE === 'prod') {
        res.status(err.statusCode).json({ err: err.message })
    } else {
        console.log(err.message);
        res.status(err.statusCode).json({ err: err.message, stack: err.stack })

    }
}