import { Response } from "express";
import { HttpStatus } from "./httpStatus";

export class ApiResponse {
  static success(
    res: Response,
    data: any,
    message = "Thành công",
    statusCode = HttpStatus.OK
  ) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static error(
    res: Response,
    message = "Lỗi",
    statusCode = HttpStatus.INTERNAL_SERVER_ERROR,
    errors = null
  ) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
      data: null,
    });
  }
}
