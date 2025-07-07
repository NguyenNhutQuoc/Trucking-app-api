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
        "Lấy danh sách số xe thành công"
      );
    } catch (error) {
      next(error);
    }
  };

  getSoxeById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const soxeService = this.createSoxeService(req);
      const id = parseInt(req.params.id);
      const soxe = await soxeService.getSoxeById(id);

      if (!soxe) {
        return ApiResponse.error(
          res,
          "Không tìm thấy số xe",
          HttpStatus.NOT_FOUND
        );
      }

      return ApiResponse.success(
        res,
        {
          data: soxe,
          tenantInfo: {
            khachHang: req.tenantInfo!.khachHang.tenKhachHang,
            tramCan: req.tenantInfo!.tramCan.tenTramCan,
          },
        },
        "Lấy thông tin số xe thành công"
      );
    } catch (error) {
      next(error);
    }
  };

  createSoxe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const soxeService = this.createSoxeService(req);
      const soxeData = req.body;
      const newSoxe = await soxeService.createSoxe(soxeData);

      return ApiResponse.success(
        res,
        {
          data: newSoxe,
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
      const soxeService = this.createSoxeService(req);
      const id = parseInt(req.params.id);
      const soxeData = req.body;
      const updatedSoxe = await soxeService.updateSoxe(id, soxeData);

      if (!updatedSoxe) {
        return ApiResponse.error(
          res,
          "Không tìm thấy số xe để cập nhật",
          HttpStatus.NOT_FOUND
        );
      }

      return ApiResponse.success(
        res,
        {
          data: updatedSoxe,
          tenantInfo: {
            khachHang: req.tenantInfo!.khachHang.tenKhachHang,
            tramCan: req.tenantInfo!.tramCan.tenTramCan,
          },
        },
        "Cập nhật số xe thành công"
      );
    } catch (error) {
      next(error);
    }
  };

  deleteSoxe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const soxeService = this.createSoxeService(req);
      const id = parseInt(req.params.id);
      const deleted = await soxeService.deleteSoxe(id);

      if (!deleted) {
        return ApiResponse.error(
          res,
          "Không tìm thấy số xe để xóa",
          HttpStatus.NOT_FOUND
        );
      }

      return ApiResponse.success(
        res,
        {
          tenantInfo: {
            khachHang: req.tenantInfo!.khachHang.tenKhachHang,
            tramCan: req.tenantInfo!.tramCan.tenTramCan,
          },
        },
        "Xóa số xe thành công"
      );
    } catch (error) {
      next(error);
    }
  };

  searchSoxeByNumber = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const soxeService = this.createSoxeService(req);
      const { number } = req.query;

      if (!number || typeof number !== "string") {
        return ApiResponse.error(
          res,
          "Số xe không được để trống",
          HttpStatus.BAD_REQUEST
        );
      }

      const soxes = await soxeService.getSoxeBySoxe(number);

      return ApiResponse.success(
        res,
        {
          data: soxes,
          tenantInfo: {
            khachHang: req.tenantInfo!.khachHang.tenKhachHang,
            tramCan: req.tenantInfo!.tramCan.tenTramCan,
          },
        },
        "Tìm kiếm số xe thành công"
      );
    } catch (error) {
      next(error);
    }
  };
}
