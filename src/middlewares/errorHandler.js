// Error catching endware.
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
    const status = err.status || 500; //Internal Server Error
    const message = err.message || err;
    console.error("Error Handler",status,err);
    res.status(status).send(message);
};
module.exports = errorHandler;