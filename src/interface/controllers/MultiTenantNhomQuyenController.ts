// src/interface/controllers/MultiTenantNhomQuyenController.ts
import { Request, Response, NextFunction } from "express";
import { NhomQuyenService } from "../../application/use-cases/NhomQuyenService";
import { NhomQuyenRepository } from "../../infrastructure/repositories/NhomQuyenRepository";
import { HttpStatus } from "../../utils/httpStatus";
import { ApiResponse } from "../../utils/apiResponse";

export class MultiTenantNhomQuyenController {
  /**
   * Tạo NhomQuyenService với DataSource từ tenant context
   */
  private createNhomQuyenService(req: Request): NhomQuyenService {
    if (!req.tenantInfo?.dataSource) {
      throw new Error("Tenant database connection not available");
    }

    // Tạo repository với DataSource cụ thể của tenant
    const nhomQuyenRepository = new NhomQuyenRepository();

    // Override repository's datasource
    (nhomQuyenRepository as any).repository =
      req.tenantInfo.dataSource.getRepository("NhomQuyen");

    // Tạo QuyenRepository với DataSource cụ thể của tenant
    const {
      QuyenRepository,
    } = require("../../infrastructure/repositories/QuyenRepository");
    const quyenRepository = new QuyenRepository();
    (quyenRepository as any).repository =
      req.tenantInfo.dataSource.getRepository("Quyen");

    return new NhomQuyenService(nhomQuyenRepository, quyenRepository);
  }

  getAllNhomQuyens = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const nhomQuyenService = this.createNhomQuyenService(req);
      const nhomQuyens = await nhomQuyenService.getAllNhomQuyens();

      return ApiResponse.success(
        res,
        {
          data: nhomQuyens,
          tenantInfo: {
            khachHang: req.tenantInfo!.khachHang.tenKhachHang,
            tramCan: req.tenantInfo!.tramCan.tenTramCan,
          },
        },
        "Lấy danh sách nhóm quyền thành công"
      );
    } catch (error) {
      next(error);
    }
  };

  getNhomQuyenById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const nhomQuyenService = this.createNhomQuyenService(req);
      const id = parseInt(req.params.id);
      const nhomQuyen = await nhomQuyenService.getNhomQuyenById(id);

      if (!nhomQuyen) {
        return ApiResponse.error(
          res,

          "Không tìm thấy nhóm quyền",
          HttpStatus.NOT_FOUND
        );
      }

      return ApiResponse.success(
        res,
        {
          data: nhomQuyen,
          tenantInfo: {
            khachHang: req.tenantInfo!.khachHang.tenKhachHang,
            tramCan: req.tenantInfo!.tramCan.tenTramCan,
          },
        },
        "Lấy thông tin nhóm quyền thành công"
      );
    } catch (error) {
      next(error);
    }
  };

  createNhomQuyen = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const nhomQuyenService = this.createNhomQuyenService(req);
      const nhomQuyenData = req.body;
      const newNhomQuyen = await nhomQuyenService.createNhomQuyen(
        nhomQuyenData
      );

      return ApiResponse.success(
        res,
        {
          data: newNhomQuyen,
          tenantInfo: {
            khachHang: req.tenantInfo!.khachHang.tenKhachHang,
            tramCan: req.tenantInfo!.tramCan.tenTramCan,
          },
        },
        "Tạo nhóm quyền thành công",
        HttpStatus.CREATED
      );
    } catch (error) {
      next(error);
    }
  };

  updateNhomQuyen = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const nhomQuyenService = this.createNhomQuyenService(req);
      const id = parseInt(req.params.id);
      const nhomQuyenData = req.body;
      const updatedNhomQuyen = await nhomQuyenService.updateNhomQuyen(
        id,
        nhomQuyenData
      );

      if (!updatedNhomQuyen) {
        return ApiResponse.error(
          res,
          "Không tìm thấy nhóm quyền để cập nhật",
          HttpStatus.NOT_FOUND
        );
      }

      return ApiResponse.success(
        res,
        {
          data: updatedNhomQuyen,
          tenantInfo: {
            khachHang: req.tenantInfo!.khachHang.tenKhachHang,
            tramCan: req.tenantInfo!.tramCan.tenTramCan,
          },
        },
        "Cập nhật nhóm quyền thành công"
      );
    } catch (error) {
      next(error);
    }
  };

  deleteNhomQuyen = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const nhomQuyenService = this.createNhomQuyenService(req);
      const id = parseInt(req.params.id);
      const deleted = await nhomQuyenService.deleteNhomQuyen(id);

      if (!deleted) {
        return ApiResponse.error(
          res,
          "Không tìm thấy nhóm quyền để xóa",
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
        "Xóa nhóm quyền thành công"
      );
    } catch (error) {
      next(error);
    }
  };
}
