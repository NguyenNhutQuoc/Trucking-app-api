import { Request, Response, NextFunction } from "express";
import { AuthService } from "../../application/use-cases/AuthService";
import { HttpStatus } from "../../utils/httpStatus";
import { ApiResponse } from "../../utils/apiResponse";
import { UnauthorizedError } from "../../utils/errors/AppError";

// Extend Express Request interface to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export class AuthController {
  constructor(private authService: AuthService) {}

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        throw new UnauthorizedError("Tên đăng nhập và mật khẩu là bắt buộc");
      }

      const result = await this.authService.login(username, password);

      return ApiResponse.success(
        res,
        result,
        "Đăng nhập thành công",
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  };

  changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        throw new UnauthorizedError(
          "Mật khẩu hiện tại và mật khẩu mới là bắt buộc"
        );
      }

      const result = await this.authService.changePassword(
        userId as string,
        currentPassword,
        newPassword
      );

      return ApiResponse.success(
        res,
        { success: result },
        "Đổi mật khẩu thành công",
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  };

  getUserPermissions = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userId } = req;

      const permissions = await this.authService.getUserPermissions(
        userId as string
      );

      return ApiResponse.success(
        res,
        permissions,
        "Quyền người dùng",
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  };

  validateToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // The token is already validated in the auth middleware
      // So we can just return success here
      return ApiResponse.success(
        res,
        { valid: true },
        "Token hợp lệ",
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  };
}
