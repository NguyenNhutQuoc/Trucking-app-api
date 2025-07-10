// src/interface/controllers/MultiTenantPhieucanController.ts
import { Request, Response, NextFunction } from "express";
import { PhieucanService } from "../../application/use-cases/PhieucanService";
import { PhieucanRepository } from "../../infrastructure/repositories/PhieucanRepository";
import { HanghoaRepository } from "../../infrastructure/repositories/HanghoaRepository";
import { HttpStatus } from "../../utils/httpStatus";
import { ApiResponse } from "../../utils/apiResponse";
import { ValidationError, NotFoundError } from "../../utils/errors/AppError";

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

  completeWeighing = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const { tlcan2, ngaycan2 } = req.body;
      const phieucanService = this.createPhieucanService(req);

      const phieucan = await phieucanService.completeWeighing(Number(id), {
        tlcan2,
        ngaycan2: new Date(ngaycan2 || new Date()),
      });

      return ApiResponse.success(
        res,
        {
          data: phieucan,
          tenantInfo: {
            khachHang: req.tenantInfo!.khachHang.tenKhachHang,
            tramCan: req.tenantInfo!.tramCan.tenTramCan,
          },
        },
        "Hoàn thành cân thành công",
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  };

  cancelPhieucan = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const phieucanService = this.createPhieucanService(req);

      const phieucan = await phieucanService.cancelPhieucan(Number(id), reason);

      return ApiResponse.success(
        res,
        {
          data: phieucan,
          tenantInfo: {
            khachHang: req.tenantInfo!.khachHang.tenKhachHang,
            tramCan: req.tenantInfo!.tramCan.tenTramCan,
          },
        },
        "Hủy phiếu cân thành công",
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  };

  getCompletedWeighings = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const phieucanService = this.createPhieucanService(req);
      const phieucans = await phieucanService.getCompletedWeighings();

      return ApiResponse.success(
        res,
        {
          data: phieucans,
          tenantInfo: {
            khachHang: req.tenantInfo!.khachHang.tenKhachHang,
            tramCan: req.tenantInfo!.tramCan.tenTramCan,
          },
        },
        "Danh sách phiếu cân đã hoàn thành",
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  };

  getPendingWeighings = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const phieucanService = this.createPhieucanService(req);
      const phieucans = await phieucanService.getPendingWeighings();

      return ApiResponse.success(
        res,
        {
          data: phieucans,
          tenantInfo: {
            khachHang: req.tenantInfo!.khachHang.tenKhachHang,
            tramCan: req.tenantInfo!.tramCan.tenTramCan,
          },
        },
        "Danh sách phiếu cân đang chờ",
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  };

  getCanceledWeighings = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const phieucanService = this.createPhieucanService(req);
      const phieucans = await phieucanService.getCanceledWeighings();

      return ApiResponse.success(
        res,
        {
          data: phieucans,
          tenantInfo: {
            khachHang: req.tenantInfo!.khachHang.tenKhachHang,
            tramCan: req.tenantInfo!.tramCan.tenTramCan,
          },
        },
        "Danh sách phiếu cân đã hủy",
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  };

  getPhieucansByDateRange = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { startDate, endDate } = req.query as {
        startDate: string;
        endDate: string;
      };

      if (!startDate || !endDate) {
        throw new ValidationError("Ngày bắt đầu và ngày kết thúc là bắt buộc");
      }

      const phieucanService = this.createPhieucanService(req);
      const phieucans = await phieucanService.getPhieucansByDateRange(
        new Date(startDate),
        new Date(endDate)
      );

      return ApiResponse.success(
        res,
        {
          data: phieucans,
          tenantInfo: {
            khachHang: req.tenantInfo!.khachHang.tenKhachHang,
            tramCan: req.tenantInfo!.tramCan.tenTramCan,
          },
        },
        "Danh sách phiếu cân theo khoảng thời gian",
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  };

  getPhieucansBySoxe = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { soxe } = req.params;
      const phieucanService = this.createPhieucanService(req);
      const phieucans = await phieucanService.getPhieucansByVehicle(soxe);

      return ApiResponse.success(
        res,
        {
          data: phieucans,
          tenantInfo: {
            khachHang: req.tenantInfo!.khachHang.tenKhachHang,
            tramCan: req.tenantInfo!.tramCan.tenTramCan,
          },
        },
        `Danh sách phiếu cân của xe ${soxe}`,
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  };

  getPhieucansByProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { mahang } = req.params;
      const phieucanService = this.createPhieucanService(req);
      const phieucans = await phieucanService.getPhieucansByProduct(mahang);

      return ApiResponse.success(
        res,
        {
          data: phieucans,
          tenantInfo: {
            khachHang: req.tenantInfo!.khachHang.tenKhachHang,
            tramCan: req.tenantInfo!.tramCan.tenTramCan,
          },
        },
        `Danh sách phiếu cân của loại hàng ${mahang}`,
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  };

  getPhieucansByCustomer = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { makh } = req.params;
      const phieucanService = this.createPhieucanService(req);
      const phieucans = await phieucanService.getPhieucansByCustomer(makh);

      return ApiResponse.success(
        res,
        {
          data: phieucans,
          tenantInfo: {
            khachHang: req.tenantInfo!.khachHang.tenKhachHang,
            tramCan: req.tenantInfo!.tramCan.tenTramCan,
          },
        },
        `Danh sách phiếu cân của khách hàng ${makh}`,
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  };

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

  getWeightStatistics = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { startDate, endDate } = req.query as {
        startDate: string;
        endDate: string;
      };

      if (!startDate || !endDate) {
        throw new ValidationError("Ngày bắt đầu và ngày kết thúc là bắt buộc");
      }

      const phieucanService = this.createPhieucanService(req);
      const statistics = await phieucanService.getWeightStatistics(
        new Date(startDate),
        new Date(endDate)
      );

      return ApiResponse.success(
        res,
        {
          data: statistics,
          tenantInfo: {
            khachHang: req.tenantInfo!.khachHang.tenKhachHang,
            tramCan: req.tenantInfo!.tramCan.tenTramCan,
          },
        },
        "Thống kê cân theo khoảng thời gian",
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  };
}
