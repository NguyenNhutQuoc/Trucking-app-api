// src/interface/middlewares/multiTenantAuthMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { MultiTenantAuthService } from "../../application/use-cases/MultiTenantAuthService";
import { DynamicDatabaseManager } from "../../config/dynamicDatabase";
import { UnauthorizedError } from "../../utils/errors/AppError";
import { ApiResponse } from "../../utils/apiResponse";
import { HttpStatus } from "../../utils/httpStatus";

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      tenantInfo?: {
        sessionToken: string;
        khachHang: {
          maKhachHang: string;
          tenKhachHang: string;
        };
        tramCan: {
          id: number;
          tenTramCan: string;
        };
        dbConfig: any;
        dataSource: any; // TypeORM DataSource
      };
    }
  }
}

export class MultiTenantAuthMiddleware {
  constructor(private multiTenantAuthService: MultiTenantAuthService) {}

  /**
   * Middleware xác thực session và thiết lập database connection
   */
  authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Lấy session token từ header hoặc body
      const sessionToken =
        (req.headers["x-session-token"] as string) ||
        req.headers["authorization"]?.replace("Bearer ", "");
      console.log("Session Token:", sessionToken);
      if (!sessionToken) {
        return ApiResponse.error(
          res,
          "Session token là bắt buộc",
          HttpStatus.UNAUTHORIZED
        );
      }

      // Validate session và lấy thông tin
      const sessionInfo = await this.multiTenantAuthService.validateSession(
        sessionToken
      );

      // Tạo hoặc lấy database connection
      const dataSource = await DynamicDatabaseManager.getDataSource({
        ...sessionInfo.dbConfig,
        instanceName: "",
      });

      // Gắn thông tin vào request
      req.tenantInfo = {
        sessionToken,
        khachHang: sessionInfo.khachHang,
        tramCan: sessionInfo.tramCan,
        dbConfig: sessionInfo.dbConfig,
        dataSource,
      };

      next();
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        return ApiResponse.error(res, error.message, HttpStatus.UNAUTHORIZED);
      }
      next(error);
    }
  };

  /**
   * Middleware chỉ validate session (không setup database)
   * Dùng cho các endpoint không cần truy cập database
   */
  validateSessionOnly = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const sessionToken =
        (req.headers["x-session-token"] as string) ||
        req.headers["authorization"]?.replace("Bearer ", "") ||
        req.body.sessionToken;

      if (!sessionToken) {
        return ApiResponse.error(
          res,
          "Session token là bắt buộc",
          HttpStatus.UNAUTHORIZED
        );
      }

      const sessionInfo = await this.multiTenantAuthService.validateSession(
        sessionToken
      );

      req.tenantInfo = {
        sessionToken,
        khachHang: sessionInfo.khachHang,
        tramCan: sessionInfo.tramCan,
        dbConfig: sessionInfo.dbConfig,
        dataSource: null,
      };

      next();
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        return ApiResponse.error(res, error.message, HttpStatus.UNAUTHORIZED);
      }
      next(error);
    }
  };
}

// Factory function để tạo middleware instance
export const createMultiTenantAuthMiddleware = (
  authService: MultiTenantAuthService
) => {
  return new MultiTenantAuthMiddleware(authService);
};
