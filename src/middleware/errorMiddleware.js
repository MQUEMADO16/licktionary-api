// Catches generic errors and formats the response
const errorHandler = (err, req, res, next) => {
  // Use the status code set by the controller, or default to 500 (Server Error)
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode);

  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { errorHandler };