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
        "Danh sách hàng hóa",
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  };

  getHanghoaById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const hanghoaService = this.createHanghoaService(req);
      const hanghoa = await hanghoaService.getHanghoaById(Number(id));

      return ApiResponse.success(
        res,
        {
          data: hanghoa,
          tenantInfo: {
            khachHang: req.tenantInfo!.khachHang.tenKhachHang,
            tramCan: req.tenantInfo!.tramCan.tenTramCan,
          },
        },
        "Chi tiết hàng hóa",
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  };

  getHanghoaByMa = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ma } = req.params;
      const hanghoaService = this.createHanghoaService(req);
      const hanghoa = await hanghoaService.getHanghoaByMa(ma);

      return ApiResponse.success(
        res,
        {
          data: hanghoa,
          tenantInfo: {
            khachHang: req.tenantInfo!.khachHang.tenKhachHang,
            tramCan: req.tenantInfo!.tramCan.tenTramCan,
          },
        },
        "Chi tiết hàng hóa",
        HttpStatus.OK
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
      const { name } = req.query as { name: string };
      const hanghoaService = this.createHanghoaService(req);

      if (!name || name.trim() === "") {
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
          "Danh sách hàng hóa",
          HttpStatus.OK
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
        `Kết quả tìm kiếm "${name}"`,
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  };

  createHanghoa = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const hanghoaData = req.body;
      const hanghoaService = this.createHanghoaService(req);
      const hanghoa = await hanghoaService.createHanghoa(hanghoaData);

      return ApiResponse.success(
        res,
        {
          data: hanghoa,
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
      const { id } = req.params;
      const hanghoaData = req.body;
      const hanghoaService = this.createHanghoaService(req);
      const hanghoa = await hanghoaService.updateHanghoa(
        Number(id),
        hanghoaData
      );

      return ApiResponse.success(
        res,
        {
          data: hanghoa,
          tenantInfo: {
            khachHang: req.tenantInfo!.khachHang.tenKhachHang,
            tramCan: req.tenantInfo!.tramCan.tenTramCan,
          },
        },
        "Cập nhật hàng hóa thành công",
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  };

  deleteHanghoa = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const hanghoaService = this.createHanghoaService(req);
      await hanghoaService.deleteHanghoa(Number(id));

      return ApiResponse.success(
        res,
        {
          data: null,
          tenantInfo: {
            khachHang: req.tenantInfo!.khachHang.tenKhachHang,
            tramCan: req.tenantInfo!.tramCan.tenTramCan,
          },
        },
        "Xóa hàng hóa thành công",
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  };
}
