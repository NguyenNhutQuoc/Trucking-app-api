import { Request, Response, NextFunction } from "express";
import { PhieucanService } from "../../application/use-cases/PhieucanService";
import { HttpStatus } from "../../utils/httpStatus";
import { ApiResponse } from "../../utils/apiResponse";
import { ValidationError, NotFoundError } from "../../utils/errors/AppError";

export class PhieucanController {
  constructor(private phieucanService: PhieucanService) {}

  getAllPhieucans = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const phieucans = await this.phieucanService.getAllPhieucans();

      return ApiResponse.success(
        res,
        phieucans,
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
      const phieucan = await this.phieucanService.getPhieucanById(Number(id));

      return ApiResponse.success(
        res,
        phieucan,
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
      const phieucan = await this.phieucanService.createPhieucan(phieucanData);

      return ApiResponse.success(
        res,
        phieucan,
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
      const phieucan = await this.phieucanService.updatePhieucan(
        Number(id),
        phieucanData
      );

      return ApiResponse.success(
        res,
        phieucan,
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
      await this.phieucanService.deletePhieucan(Number(id));

      return ApiResponse.success(
        res,
        null,
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

      const phieucan = await this.phieucanService.completeWeighing(Number(id), {
        tlcan2,
        ngaycan2: new Date(ngaycan2 || new Date()),
      });

      return ApiResponse.success(
        res,
        phieucan,
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

      const phieucan = await this.phieucanService.cancelPhieucan(
        Number(id),
        reason
      );

      return ApiResponse.success(
        res,
        phieucan,
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
      const phieucans = await this.phieucanService.getCompletedWeighings();

      return ApiResponse.success(
        res,
        phieucans,
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
      const phieucans = await this.phieucanService.getPendingWeighings();

      return ApiResponse.success(
        res,
        phieucans,
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
      const phieucans = await this.phieucanService.getCanceledWeighings();

      return ApiResponse.success(
        res,
        phieucans,
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

      const phieucans = await this.phieucanService.getPhieucansByDateRange(
        new Date(startDate),
        new Date(endDate)
      );

      return ApiResponse.success(
        res,
        phieucans,
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

      const phieucans = await this.phieucanService.getPhieucansByVehicle(soxe);

      return ApiResponse.success(
        res,
        phieucans,
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

      const phieucans = await this.phieucanService.getPhieucansByProduct(
        mahang
      );

      return ApiResponse.success(
        res,
        phieucans,
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

      const phieucans = await this.phieucanService.getPhieucansByCustomer(makh);

      return ApiResponse.success(
        res,
        phieucans,
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
      const statistics = await this.phieucanService.getTodayStatistics();

      return ApiResponse.success(
        res,
        statistics,
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

      const statistics = await this.phieucanService.getWeightStatistics(
        new Date(startDate),
        new Date(endDate)
      );

      return ApiResponse.success(
        res,
        statistics,
        "Thống kê cân theo khoảng thời gian",
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  };
}
