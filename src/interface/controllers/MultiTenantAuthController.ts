// src/interface/controllers/MultiTenantAuthController.ts
import { Request, Response, NextFunction } from "express";
import { MultiTenantAuthService } from "../../application/use-cases/MultiTenantAuthService";
import { HttpStatus } from "../../utils/httpStatus";
import { ApiResponse } from "../../utils/apiResponse";

export class MultiTenantAuthController {
  constructor(private multiTenantAuthService: MultiTenantAuthService) {}

  /**
   * POST /api/v1/auth/tenant-login
   * Step 1: Login và lấy danh sách trạm cân
   */
  tenantLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { maKhachHang, password } = req.body;

      if (!maKhachHang || !password) {
        return ApiResponse.error(
          res,
          "Mã khách hàng và mật khẩu là bắt buộc",
          HttpStatus.BAD_REQUEST
        );
      }

      const result = await this.multiTenantAuthService.login({
        maKhachHang,
        password,
      });

      return ApiResponse.success(
        res,
        result,
        "Đăng nhập thành công. Vui lòng chọn trạm cân.",
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/auth/select-station
   * Step 2: Chọn trạm cân và hoàn thành authentication
   */
  selectStation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sessionToken, tramCanId } = req.body;

      if (!sessionToken || !tramCanId) {
        return ApiResponse.error(
          res,
          "Session token và ID trạm cân là bắt buộc",
          HttpStatus.BAD_REQUEST
        );
      }

      const result = await this.multiTenantAuthService.selectStation({
        sessionToken,
        tramCanId: Number(tramCanId),
      });

      return ApiResponse.success(
        res,
        result,
        "Chọn trạm cân thành công",
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/auth/validate-session
   * Validate session và lấy thông tin
   */
  validateSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sessionToken } = req.body;

      if (!sessionToken) {
        return ApiResponse.error(
          res,
          "Session token là bắt buộc",
          HttpStatus.BAD_REQUEST
        );
      }

      const result = await this.multiTenantAuthService.validateSession(
        sessionToken
      );

      return ApiResponse.success(res, result, "Session hợp lệ", HttpStatus.OK);
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/auth/logout
   * Đăng xuất
   */
  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sessionToken } = req.body;

      if (!sessionToken) {
        return ApiResponse.error(
          res,
          "Session token là bắt buộc",
          HttpStatus.BAD_REQUEST
        );
      }

      const result = await this.multiTenantAuthService.logout(sessionToken);

      return ApiResponse.success(
        res,
        { success: result },
        "Đăng xuất thành công",
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/auth/refresh-session
   * Gia hạn session
   */
  refreshSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sessionToken } = req.body;

      if (!sessionToken) {
        return ApiResponse.error(
          res,
          "Session token là bắt buộc",
          HttpStatus.BAD_REQUEST
        );
      }

      const result = await this.multiTenantAuthService.refreshSession(
        sessionToken
      );

      return ApiResponse.success(
        res,
        { success: result },
        result ? "Gia hạn session thành công" : "Gia hạn session thất bại",
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  };
}
