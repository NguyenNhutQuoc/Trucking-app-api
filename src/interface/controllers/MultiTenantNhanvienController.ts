// src/interface/controllers/MultiTenantNhanvienController.ts
import { Request, Response, NextFunction } from "express";
import { NhanvienService } from "../../application/use-cases/NhanvienService";
import { NhanvienRepository } from "../../infrastructure/repositories/NhanvienRepository";
import { HttpStatus } from "../../utils/httpStatus";
import { ApiResponse } from "../../utils/apiResponse";

export class MultiTenantNhanvienController {
  /**
   * Tạo NhanvienService với DataSource từ tenant context
   */
  private createNhanvienService(req: Request): NhanvienService {
    if (!req.tenantInfo?.dataSource) {
      throw new Error("Tenant database connection not available");
    }

    // Tạo repository với DataSource cụ thể của tenant
    const nhanvienRepository = new NhanvienRepository();

    // Override repository's datasource
    (nhanvienRepository as any).repository =
      req.tenantInfo.dataSource.getRepository("Nhanvien");

    return new NhanvienService(nhanvienRepository);
  }

  getAllNhanviens = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const nhanvienService = this.createNhanvienService(req);
      const nhanviens = await nhanvienService.getAllNhanviens();

      return ApiResponse.success(
        res,
        {
          data: nhanviens,
          tenantInfo: {
            khachHang: req.tenantInfo!.khachHang.tenKhachHang,
            tramCan: req.tenantInfo!.tramCan.tenTramCan,
          },
        },
        "Danh sách nhân viên",
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  };

  getNhanvienById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { nvId } = req.params;
      const nhanvienService = this.createNhanvienService(req);
      const nhanvien = await nhanvienService.getNhanvienById(nvId);

      return ApiResponse.success(
        res,
        {
          data: nhanvien,
          tenantInfo: {
            khachHang: req.tenantInfo!.khachHang.tenKhachHang,
            tramCan: req.tenantInfo!.tramCan.tenTramCan,
          },
        },
        "Chi tiết nhân viên",
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  };

  createNhanvien = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const nhanvienService = this.createNhanvienService(req);
      const nhanvien = await nhanvienService.createNhanvien(data);

      return ApiResponse.success(
        res,
        {
          data: nhanvien,
          tenantInfo: {
            khachHang: req.tenantInfo!.khachHang.tenKhachHang,
            tramCan: req.tenantInfo!.tramCan.tenTramCan,
          },
        },
        "Tạo nhân viên thành công",
        HttpStatus.CREATED
      );
    } catch (error) {
      next(error);
    }
  };

  updateNhanvien = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { nvId } = req.params;
      const data = req.body;
      const nhanvienService = this.createNhanvienService(req);
      const nhanvien = await nhanvienService.updateNhanvien(nvId, data);

      return ApiResponse.success(
        res,
        {
          data: nhanvien,
          tenantInfo: {
            khachHang: req.tenantInfo!.khachHang.tenKhachHang,
            tramCan: req.tenantInfo!.tramCan.tenTramCan,
          },
        },
        "Cập nhật nhân viên thành công",
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  };

  deleteNhanvien = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { nvId } = req.params;
      const nhanvienService = this.createNhanvienService(req);
      await nhanvienService.deleteNhanvien(nvId);

      return ApiResponse.success(
        res,
        {
          data: null,
          tenantInfo: {
            khachHang: req.tenantInfo!.khachHang.tenKhachHang,
            tramCan: req.tenantInfo!.tramCan.tenTramCan,
          },
        },
        "Xóa nhân viên thành công",
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  };
}
