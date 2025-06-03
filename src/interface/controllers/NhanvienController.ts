import { Request, Response, NextFunction } from "express";
import { NhanvienService } from "../../application/use-cases/NhanvienService";
import { HttpStatus } from "../../utils/httpStatus";
import { ApiResponse } from "../../utils/apiResponse";

export class NhanvienController {
  constructor(private nhanvienService: NhanvienService) {}

  getAllNhanviens = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const nhanviens = await this.nhanvienService.getAllNhanviens();
      return ApiResponse.success(
        res,
        nhanviens,
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
      const nhanvien = await this.nhanvienService.getNhanvienById(nvId);
      return ApiResponse.success(
        res,
        nhanvien,
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
      const nhanvien = await this.nhanvienService.createNhanvien(data);
      return ApiResponse.success(
        res,
        nhanvien,
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
      const nhanvien = await this.nhanvienService.updateNhanvien(nvId, data);
      return ApiResponse.success(
        res,
        nhanvien,
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
      await this.nhanvienService.deleteNhanvien(nvId);
      return ApiResponse.success(
        res,
        null,
        "Xóa nhân viên thành công",
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  };
}
