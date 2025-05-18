import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../../utils/apiResponse";
import { HttpStatus } from "../../utils/httpStatus";
import {
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
} from "../../utils/errors/AppError";
import { logger } from "../../utils/logger";

export function errorMiddleware(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  logger.error(`Error: ${error.message}`, { stack: error.stack });

  if (error instanceof NotFoundError) {
    ApiResponse.error(res, error.message, HttpStatus.NOT_FOUND);
    return;
  }
  if (error instanceof ValidationError) {
    ApiResponse.error(res, error.message, HttpStatus.BAD_REQUEST);
    return;
  }
  if (error instanceof UnauthorizedError) {
    ApiResponse.error(res, error.message, HttpStatus.UNAUTHORIZED);
    return;
  }
  if (error instanceof ForbiddenError) {
    ApiResponse.error(res, error.message, HttpStatus.FORBIDDEN);
    return;
  }
  if (error.name === "QueryFailedError") {
    ApiResponse.error(
      res,
      "Lỗi cơ sở dữ liệu, vui lòng thử lại",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
    return;
  }
  ApiResponse.error(
    res,
    "Đã xảy ra lỗi máy chủ nội bộ",
    HttpStatus.INTERNAL_SERVER_ERROR
  );
}
