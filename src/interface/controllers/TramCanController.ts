// src/interface/controllers/TramCanController.ts
import { Request, Response, NextFunction } from "express";
import { TramCanService } from "../../application/use-cases/TramCanService";
import { HttpStatus } from "../../utils/httpStatus";
import { ApiResponse } from "../../utils/apiResponse";

export class TramCanController {
  constructor(private tramCanService: TramCanService) {}

  /**
   * GET /api/v1/tramcan
   * Lấy danh sách tất cả trạm cân (cho admin)
   */
  getAllTramCans = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tramCans = await this.tramCanService.getAllTramCans();

      return ApiResponse.success(
        res,
        tramCans,
        "Danh sách tất cả trạm cân",
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/tramcan/my-stations
   * Lấy danh sách trạm cân của khách hàng hiện tại
   * Require: sessionToken để xác định khách hàng
   */
  getMyStations = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Lấy thông tin khách hàng từ session
      const sessionToken = req.headers["x-session-token"] as string;
      const sessionInfo = await this.tramCanService.getSessionInfo(
        sessionToken
      );

      const tramCans = await this.tramCanService.getTramCansByKhachHang(
        sessionInfo.khachHangId
      );

      return ApiResponse.success(
        res,
        {
          khachHang: sessionInfo.khachHang,
          tramCans: tramCans,
          currentStation: sessionInfo.tramCan || null,
        },
        "Danh sách trạm cân của bạn",
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/tramcan/:id
   * Lấy chi tiết một trạm cân
   */
  getTramCanById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const tramCan = await this.tramCanService.getTramCanById(Number(id));

      return ApiResponse.success(
        res,
        tramCan,
        "Chi tiết trạm cân",
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/tramcan/switch-station
   * Chuyển đổi trạm cân trong phiên làm việc hiện tại
   */
  switchStation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { tramCanId } = req.body;
      const sessionToken = req.headers["x-session-token"] as string;

      const result = await this.tramCanService.switchStation(
        sessionToken,
        tramCanId
      );

      return ApiResponse.success(
        res,
        result,
        "Chuyển trạm cân thành công",
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/tramcan (Admin only)
   * Tạo trạm cân mới
   */
  createTramCan = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tramCanData = req.body;
      const tramCan = await this.tramCanService.createTramCan(tramCanData);

      return ApiResponse.success(
        res,
        tramCan,
        "Tạo trạm cân thành công",
        HttpStatus.CREATED
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /api/v1/tramcan/:id (Admin only)
   * Cập nhật trạm cân
   */
  updateTramCan = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const tramCanData = req.body;

      const tramCan = await this.tramCanService.updateTramCan(
        Number(id),
        tramCanData
      );

      return ApiResponse.success(
        res,
        tramCan,
        "Cập nhật trạm cân thành công",
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /api/v1/tramcan/:id (Admin only)
   * Xóa trạm cân
   */
  deleteTramCan = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.tramCanService.deleteTramCan(Number(id));

      return ApiResponse.success(
        res,
        null,
        "Xóa trạm cân thành công",
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  };
}
