import { ApiError } from "../utils/ApiError.js";
export const validate = (schema, type = "body") => (req, res, next) => {
  const result = schema.safeParse(req[type]);

  if (!result.success) {
    const errorMessages = result.error.issues.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));
    return next(new ApiError(400, "Validation Error", errorMessages));
  }

  req[type] = result.data;
  next();
};