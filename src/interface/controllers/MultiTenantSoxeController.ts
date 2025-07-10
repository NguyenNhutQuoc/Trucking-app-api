// src/interface/controllers/MultiTenantSoxeController.ts
import { Request, Response, NextFunction } from "express";
import { SoxeService } from "../../application/use-cases/SoxeService";
import { SoxeRepository } from "../../infrastructure/repositories/SoxeRepository";
import { HttpStatus } from "../../utils/httpStatus";
import { ApiResponse } from "../../utils/apiResponse";

export class MultiTenantSoxeController {
  /**
   * Tạo SoxeService với DataSource từ tenant context
   */
  private createSoxeService(req: Request): SoxeService {
    if (!req.tenantInfo?.dataSource) {
      throw new Error("Tenant database connection not available");
    }

    // Tạo repository với DataSource cụ thể của tenant
    const soxeRepository = new SoxeRepository();

    // Override repository's datasource
    (soxeRepository as any).repository =
      req.tenantInfo.dataSource.getRepository("Soxe");

    return new SoxeService(soxeRepository);
  }

  getAllSoxes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const soxeService = this.createSoxeService(req);
      const soxes = await soxeService.getAllSoxes();

      return ApiResponse.success(
        res,
        {
          data: soxes,
          tenantInfo: {
            khachHang: req.tenantInfo!.khachHang.tenKhachHang,
            tramCan: req.tenantInfo!.tramCan.tenTramCan,
          },
        },
        "Danh sách số xe",
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  };

  getSoxeById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const soxeService = this.createSoxeService(req);
      const soxe = await soxeService.getSoxeById(Number(id));

      return ApiResponse.success(
        res,
        {
          data: soxe,
          tenantInfo: {
            khachHang: req.tenantInfo!.khachHang.tenKhachHang,
            tramCan: req.tenantInfo!.tramCan.tenTramCan,
          },
        },
        "Chi tiết số xe",
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  };

  getSoxeBySoxe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { soxe } = req.params;
      const soxeService = this.createSoxeService(req);
      const result = await soxeService.getSoxeBySoxe(soxe);

      return ApiResponse.success(
        res,
        {
          data: result,
          tenantInfo: {
            khachHang: req.tenantInfo!.khachHang.tenKhachHang,
            tramCan: req.tenantInfo!.tramCan.tenTramCan,
          },
        },
        "Chi tiết số xe",
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  };

  createSoxe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const soxeData = req.body;
      const soxeService = this.createSoxeService(req);
      const soxe = await soxeService.createSoxe(soxeData);

      return ApiResponse.success(
        res,
        {
          data: soxe,
          tenantInfo: {
            khachHang: req.tenantInfo!.khachHang.tenKhachHang,
            tramCan: req.tenantInfo!.tramCan.tenTramCan,
          },
        },
        "Tạo số xe thành công",
        HttpStatus.CREATED
      );
    } catch (error) {
      next(error);
    }
  };

  updateSoxe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const soxeData = req.body;
      const soxeService = this.createSoxeService(req);
      const soxe = await soxeService.updateSoxe(Number(id), soxeData);

      return ApiResponse.success(
        res,
        {
          data: soxe,
          tenantInfo: {
            khachHang: req.tenantInfo!.khachHang.tenKhachHang,
            tramCan: req.tenantInfo!.tramCan.tenTramCan,
          },
        },
        "Cập nhật số xe thành công",
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  };

  deleteSoxe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const soxeService = this.createSoxeService(req);
      await soxeService.deleteSoxe(Number(id));

      return ApiResponse.success(
        res,
        {
          data: null,
          tenantInfo: {
            khachHang: req.tenantInfo!.khachHang.tenKhachHang,
            tramCan: req.tenantInfo!.tramCan.tenTramCan,
          },
        },
        "Xóa số xe thành công",
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  };
}
