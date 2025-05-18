import { Request, Response, NextFunction } from "express";
import { SoxeService } from "../../application/use-cases/SoxeService";
import { HttpStatus } from "../../utils/httpStatus";
import { ApiResponse } from "../../utils/apiResponse";

export class SoxeController {
  constructor(private soxeService: SoxeService) {}

  getAllSoxes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const soxes = await this.soxeService.getAllSoxes();

      return ApiResponse.success(res, soxes, "Danh sách số xe", HttpStatus.OK);
    } catch (error) {
      next(error);
    }
  };

  getSoxeById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const soxe = await this.soxeService.getSoxeById(Number(id));

      return ApiResponse.success(res, soxe, "Chi tiết số xe", HttpStatus.OK);
    } catch (error) {
      next(error);
    }
  };

  getSoxeBySoxe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { soxe } = req.params;
      const result = await this.soxeService.getSoxeBySoxe(soxe);

      return ApiResponse.success(res, result, "Chi tiết số xe", HttpStatus.OK);
    } catch (error) {
      next(error);
    }
  };

  createSoxe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const soxeData = req.body;
      const soxe = await this.soxeService.createSoxe(soxeData);

      return ApiResponse.success(
        res,
        soxe,
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
      const soxe = await this.soxeService.updateSoxe(Number(id), soxeData);

      return ApiResponse.success(
        res,
        soxe,
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
      await this.soxeService.deleteSoxe(Number(id));

      return ApiResponse.success(
        res,
        null,
        "Xóa số xe thành công",
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  };
}
