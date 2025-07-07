// src/interface/controllers/MultiTenantHanghoaController.ts
import { Request, Response, NextFunction } from "express";
import { HanghoaService } from "../../application/use-cases/HanghoaService";
import { HanghoaRepository } from "../../infrastructure/repositories/HanghoaRepository";
import { HttpStatus } from "../../utils/httpStatus";
import { ApiResponse } from "../../utils/apiResponse";

export class MultiTenantHanghoaController {
  /**
   * Tạo HanghoaService với DataSource từ tenant context
   */
  private createHanghoaService(req: Request): HanghoaService {
    if (!req.tenantInfo?.dataSource) {
      throw new Error("Tenant database connection not available");
    }

    // Tạo repository với DataSource cụ thể của tenant
    const hanghoaRepository = new HanghoaRepository();

    // Override repository's datasource
    (hanghoaRepository as any).repository =
      req.tenantInfo.dataSource.getRepository("Hanghoa");

    return new HanghoaService(hanghoaRepository);
  }

  getAllHanghoas = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const hanghoaService = this.createHanghoaService(req);
      const hanghoas = await hanghoaService.getAllHanghoas();

      return ApiResponse.success(
        res,
        {
          data: hanghoas,
          tenantInfo: {
            khachHang: req.tenantInfo!.khachHang.tenKhachHang,
            tramCan: req.tenantInfo!.tramCan.tenTramCan,
          },
        },
        "Lấy danh sách hàng hóa thành công"
      );
    } catch (error) {
      next(error);
    }
  };

  getHanghoaById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const hanghoaService = this.createHanghoaService(req);
      const id = parseInt(req.params.id);
      const hanghoa = await hanghoaService.getHanghoaById(id);

      if (!hanghoa) {
        return ApiResponse.error(
          res,
          "Không tìm thấy hàng hóa",
          HttpStatus.NOT_FOUND
        );
      }

      return ApiResponse.success(
        res,
        {
          data: hanghoa,
          tenantInfo: {
            khachHang: req.tenantInfo!.khachHang.tenKhachHang,
            tramCan: req.tenantInfo!.tramCan.tenTramCan,
          },
        },
        "Lấy thông tin hàng hóa thành công"
      );
    } catch (error) {
      next(error);
    }
  };

  createHanghoa = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const hanghoaService = this.createHanghoaService(req);
      const hanghoaData = req.body;
      const newHanghoa = await hanghoaService.createHanghoa(hanghoaData);

      return ApiResponse.success(
        res,
        {
          data: newHanghoa,
          tenantInfo: {
            khachHang: req.tenantInfo!.khachHang.tenKhachHang,
            tramCan: req.tenantInfo!.tramCan.tenTramCan,
          },
        },
        "Tạo hàng hóa thành công",
        HttpStatus.CREATED
      );
    } catch (error) {
      next(error);
    }
  };

  updateHanghoa = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const hanghoaService = this.createHanghoaService(req);
      const id = parseInt(req.params.id);
      const hanghoaData = req.body;
      const updatedHanghoa = await hanghoaService.updateHanghoa(
        id,
        hanghoaData
      );

      if (!updatedHanghoa) {
        return ApiResponse.error(
          res,
          "Không tìm thấy hàng hóa để cập nhật",
          HttpStatus.NOT_FOUND
        );
      }

      return ApiResponse.success(
        res,
        {
          data: updatedHanghoa,
          tenantInfo: {
            khachHang: req.tenantInfo!.khachHang.tenKhachHang,
            tramCan: req.tenantInfo!.tramCan.tenTramCan,
          },
        },
        "Cập nhật hàng hóa thành công"
      );
    } catch (error) {
      next(error);
    }
  };

  deleteHanghoa = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const hanghoaService = this.createHanghoaService(req);
      const id = parseInt(req.params.id);
      const deleted = await hanghoaService.deleteHanghoa(id);

      if (!deleted) {
        return ApiResponse.error(
          res,

          "Không tìm thấy hàng hóa để xóa",
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
        "Xóa hàng hóa thành công"
      );
    } catch (error) {
      next(error);
    }
  };

  searchHanghoaByName = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const hanghoaService = this.createHanghoaService(req);
      const { name } = req.query;

      if (!name || typeof name !== "string") {
        return ApiResponse.error(
          res,

          "Tên hàng hóa không được để trống",
          HttpStatus.BAD_REQUEST
        );
      }

      const hanghoas = await hanghoaService.searchHanghoaByName(name);

      return ApiResponse.success(
        res,
        {
          data: hanghoas,
          tenantInfo: {
            khachHang: req.tenantInfo!.khachHang.tenKhachHang,
            tramCan: req.tenantInfo!.tramCan.tenTramCan,
          },
        },
        "Tìm kiếm hàng hóa thành công"
      );
    } catch (error) {
      next(error);
    }
  };
}
