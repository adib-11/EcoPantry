/**
 * Global error handling middleware
 * Catches errors from routes and returns standardized error responses
 */

const errorHandler = (err, req, res, next) => {
  // Log error details
  console.error('═══════════════════════════════════════');
  console.error('❌ Error occurred:');
  console.error('Time:', new Date().toISOString());
  console.error('Path:', req.path);
  console.error('Method:', req.method);
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  console.error('═══════════════════════════════════════');

  // Determine status code
  const statusCode = err.statusCode || err.status || 500;

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: {
      name: err.name || 'Error',
      message: err.message || 'An unexpected error occurred',
      ...(process.env.NODE_ENV === 'development' && {
        stack: err.stack,
        details: err.details
      })
    }
  });
};

module.exports = errorHandler;
