// src/interface/controllers/MultiTenantKhachhangController.ts
import { Request, Response, NextFunction } from "express";
import { KhachhangService } from "../../application/use-cases/KhachhangService";
import { KhachhangRepository } from "../../infrastructure/repositories/KhachhangRepository";
import { HttpStatus } from "../../utils/httpStatus";
import { ApiResponse } from "../../utils/apiResponse";

export class MultiTenantKhachhangController {
  /**
   * Tạo KhachhangService với DataSource từ tenant context
   */
  private createKhachhangService(req: Request): KhachhangService {
    if (!req.tenantInfo?.dataSource) {
      throw new Error("Tenant database connection not available");
    }

    // Tạo repository với DataSource cụ thể của tenant
    const khachhangRepository = new KhachhangRepository();

    // Override repository's datasource
    (khachhangRepository as any).repository =
      req.tenantInfo.dataSource.getRepository("Khachhang");

    return new KhachhangService(khachhangRepository);
  }

  getAllKhachhangs = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const khachhangService = this.createKhachhangService(req);
      const khachhangs = await khachhangService.getAllKhachhangs();

      return ApiResponse.success(
        res,
        {
          data: khachhangs,
          tenantInfo: {
            khachHang: req.tenantInfo!.khachHang.tenKhachHang,
            tramCan: req.tenantInfo!.tramCan.tenTramCan,
          },
        },
        "Lấy danh sách khách hàng thành công"
      );
    } catch (error) {
      next(error);
    }
  };

  getKhachhangById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const khachhangService = this.createKhachhangService(req);
      const id = parseInt(req.params.id);
      const khachhang = await khachhangService.getKhachhangById(id);

      if (!khachhang) {
        return ApiResponse.error(
          res,
          "Không tìm thấy khách hàng",
          HttpStatus.NOT_FOUND
        );
      }

      return ApiResponse.success(
        res,
        {
          data: khachhang,
          tenantInfo: {
            khachHang: req.tenantInfo!.khachHang.tenKhachHang,
            tramCan: req.tenantInfo!.tramCan.tenTramCan,
          },
        },
        "Lấy thông tin khách hàng thành công"
      );
    } catch (error) {
      next(error);
    }
  };

  createKhachhang = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const khachhangService = this.createKhachhangService(req);
      const khachhangData = req.body;
      const newKhachhang = await khachhangService.createKhachhang(
        khachhangData
      );

      return ApiResponse.success(
        res,
        {
          data: newKhachhang,
          tenantInfo: {
            khachHang: req.tenantInfo!.khachHang.tenKhachHang,
            tramCan: req.tenantInfo!.tramCan.tenTramCan,
          },
        },
        "Tạo khách hàng thành công",
        HttpStatus.CREATED
      );
    } catch (error) {
      next(error);
    }
  };

  updateKhachhang = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const khachhangService = this.createKhachhangService(req);
      const id = parseInt(req.params.id);
      const khachhangData = req.body;
      const updatedKhachhang = await khachhangService.updateKhachhang(
        id,
        khachhangData
      );

      if (!updatedKhachhang) {
        return ApiResponse.error(
          res,
          "Không tìm thấy khách hàng để cập nhật",
          HttpStatus.NOT_FOUND
        );
      }

      return ApiResponse.success(
        res,
        {
          data: updatedKhachhang,
          tenantInfo: {
            khachHang: req.tenantInfo!.khachHang.tenKhachHang,
            tramCan: req.tenantInfo!.tramCan.tenTramCan,
          },
        },
        "Cập nhật khách hàng thành công"
      );
    } catch (error) {
      next(error);
    }
  };

  deleteKhachhang = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const khachhangService = this.createKhachhangService(req);
      const id = parseInt(req.params.id);
      const deleted = await khachhangService.deleteKhachhang(id);

      if (!deleted) {
        return ApiResponse.error(
          res,
          "Không tìm thấy khách hàng để xóa",
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
        "Xóa khách hàng thành công"
      );
    } catch (error) {
      next(error);
    }
  };

  searchKhachhangByName = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const khachhangService = this.createKhachhangService(req);
      const { name } = req.query;

      if (!name || typeof name !== "string") {
        return ApiResponse.error(
          res,
          "Tên khách hàng không được để trống",
          HttpStatus.BAD_REQUEST
        );
      }

      const khachhangs = await khachhangService.searchKhachhangByName(name);

      return ApiResponse.success(
        res,
        {
          data: khachhangs,
          tenantInfo: {
            khachHang: req.tenantInfo!.khachHang.tenKhachHang,
            tramCan: req.tenantInfo!.tramCan.tenTramCan,
          },
        },
        "Tìm kiếm khách hàng thành công"
      );
    } catch (error) {
      next(error);
    }
  };
}
