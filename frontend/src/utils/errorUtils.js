/**
 * Extract a user-friendly error message from an axios error object.
 * @param {Object} error - The axios error object.
 * @param {string} fallback - A fallback message if no specific error is found.
 * @returns {string} - The processed error message.
 */
export const getErrorMessage = (error, fallback = "Something went wrong. Please try again.") => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.message) {
    return error.message;
  }
  return fallback;
};
