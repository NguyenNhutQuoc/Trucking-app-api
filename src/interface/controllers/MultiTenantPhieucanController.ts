// src/interface/controllers/MultiTenantPhieucanController.ts - Updated để sử dụng dynamic database
import { Request, Response, NextFunction } from "express";
import { PhieucanService } from "../../application/use-cases/PhieucanService";
import { PhieucanRepository } from "../../infrastructure/repositories/PhieucanRepository";
import { HanghoaRepository } from "../../infrastructure/repositories/HanghoaRepository";
import { HttpStatus } from "../../utils/httpStatus";
import { ApiResponse } from "../../utils/apiResponse";

export class MultiTenantPhieucanController {
  /**
   * Tạo PhieucanService với DataSource từ tenant context
   */
  private createPhieucanService(req: Request): PhieucanService {
    if (!req.tenantInfo?.dataSource) {
      throw new Error("Tenant database connection not available");
    }

    // Tạo repositories với DataSource cụ thể của tenant
    const phieucanRepository = new PhieucanRepository();
    const hanghoaRepository = new HanghoaRepository();

    // Override repository's datasource
    (phieucanRepository as any).repository =
      req.tenantInfo.dataSource.getRepository("Phieucan");
    (hanghoaRepository as any).repository =
      req.tenantInfo.dataSource.getRepository("Hanghoa");

    return new PhieucanService(phieucanRepository, hanghoaRepository);
  }

  getAllPhieucans = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const phieucanService = this.createPhieucanService(req);
      const phieucans = await phieucanService.getAllPhieucans();

      return ApiResponse.success(
        res,
        {
          data: phieucans,
          tenantInfo: {
            khachHang: req.tenantInfo!.khachHang.tenKhachHang,
            tramCan: req.tenantInfo!.tramCan.tenTramCan,
          },
        },
        "Danh sách phiếu cân",
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  };

  getPhieucanById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const phieucanService = this.createPhieucanService(req);
      const phieucan = await phieucanService.getPhieucanById(Number(id));

      return ApiResponse.success(
        res,
        {
          data: phieucan,
          tenantInfo: {
            khachHang: req.tenantInfo!.khachHang.tenKhachHang,
            tramCan: req.tenantInfo!.tramCan.tenTramCan,
          },
        },
        "Chi tiết phiếu cân",
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  };

  createPhieucan = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const phieucanData = req.body;
      const phieucanService = this.createPhieucanService(req);

      // Thêm thông tin tenant vào phiếu cân
      phieucanData.nhanvien = req.tenantInfo!.khachHang.tenKhachHang;

      const phieucan = await phieucanService.createPhieucan(phieucanData);

      return ApiResponse.success(
        res,
        {
          data: phieucan,
          tenantInfo: {
            khachHang: req.tenantInfo!.khachHang.tenKhachHang,
            tramCan: req.tenantInfo!.tramCan.tenTramCan,
          },
        },
        "Tạo phiếu cân thành công",
        HttpStatus.CREATED
      );
    } catch (error) {
      next(error);
    }
  };

  updatePhieucan = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const phieucanData = req.body;
      const phieucanService = this.createPhieucanService(req);

      const phieucan = await phieucanService.updatePhieucan(
        Number(id),
        phieucanData
      );

      return ApiResponse.success(
        res,
        {
          data: phieucan,
          tenantInfo: {
            khachHang: req.tenantInfo!.khachHang.tenKhachHang,
            tramCan: req.tenantInfo!.tramCan.tenTramCan,
          },
        },
        "Cập nhật phiếu cân thành công",
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  };

  deletePhieucan = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const phieucanService = this.createPhieucanService(req);

      await phieucanService.deletePhieucan(Number(id));

      return ApiResponse.success(
        res,
        {
          data: null,
          tenantInfo: {
            khachHang: req.tenantInfo!.khachHang.tenKhachHang,
            tramCan: req.tenantInfo!.tramCan.tenTramCan,
          },
        },
        "Xóa phiếu cân thành công",
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  };

  // Implement other methods similarly...
  getTodayStatistics = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const phieucanService = this.createPhieucanService(req);
      const statistics = await phieucanService.getTodayStatistics();

      return ApiResponse.success(
        res,
        {
          data: statistics,
          tenantInfo: {
            khachHang: req.tenantInfo!.khachHang.tenKhachHang,
            tramCan: req.tenantInfo!.tramCan.tenTramCan,
          },
        },
        "Thống kê hôm nay",
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  };
}
