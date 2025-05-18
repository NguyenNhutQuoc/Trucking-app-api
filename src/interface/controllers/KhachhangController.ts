import { Request, Response, NextFunction } from "express";
import { KhachhangService } from "../../application/use-cases/KhachhangService";
import { HttpStatus } from "../../utils/httpStatus";
import { ApiResponse } from "../../utils/apiResponse";

export class KhachhangController {
  constructor(private khachhangService: KhachhangService) {}

  getAllKhachhangs = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const khachhangs = await this.khachhangService.getAllKhachhangs();

      return ApiResponse.success(
        res,
        khachhangs,
        "Danh sách khách hàng",
        HttpStatus.OK
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
      const { id } = req.params;
      const khachhang = await this.khachhangService.getKhachhangById(
        Number(id)
      );

      return ApiResponse.success(
        res,
        khachhang,
        "Chi tiết khách hàng",
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  };

  getKhachhangByMa = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { ma } = req.params;
      const khachhang = await this.khachhangService.getKhachhangByMa(ma);

      return ApiResponse.success(
        res,
        khachhang,
        "Chi tiết khách hàng",
        HttpStatus.OK
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
      const { name } = req.query as { name: string };

      if (!name || name.trim() === "") {
        const khachhangs = await this.khachhangService.getAllKhachhangs();
        return ApiResponse.success(
          res,
          khachhangs,
          "Danh sách khách hàng",
          HttpStatus.OK
        );
      }

      const khachhangs = await this.khachhangService.searchKhachhangByName(
        name
      );

      return ApiResponse.success(
        res,
        khachhangs,
        `Kết quả tìm kiếm "${name}"`,
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  };

  createKhachhang = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const khachhangData = req.body;
      const khachhang = await this.khachhangService.createKhachhang(
        khachhangData
      );

      return ApiResponse.success(
        res,
        khachhang,
        "Tạo khách hàng thành công",
        HttpStatus.CREATED
      );
    } catch (error) {
      next(error);
    }
  };

  updateKhachhang = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const khachhangData = req.body;
      const khachhang = await this.khachhangService.updateKhachhang(
        Number(id),
        khachhangData
      );

      return ApiResponse.success(
        res,
        khachhang,
        "Cập nhật khách hàng thành công",
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  };

  deleteKhachhang = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.khachhangService.deleteKhachhang(Number(id));

      return ApiResponse.success(
        res,
        null,
        "Xóa khách hàng thành công",
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  };
}
