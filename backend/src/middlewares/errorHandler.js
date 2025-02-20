const errorHandler = (err, req, res, next) => {
    // console.error(err); // Logs the error (optional)
  
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
  
    res.status(statusCode).json({
      success: false,
      statusCode,
      message,
      errors: err.errors || [],
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined, // Show stack only in dev mode
    });
  };
  
  export default errorHandler;
  