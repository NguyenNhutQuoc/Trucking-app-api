import { Request, Response, NextFunction } from "express";
import { HanghoaService } from "../../application/use-cases/HanghoaService";
import { HttpStatus } from "../../utils/httpStatus";
import { ApiResponse } from "../../utils/apiResponse";

export class HanghoaController {
  constructor(private hanghoaService: HanghoaService) {}

  getAllHanghoas = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const hanghoas = await this.hanghoaService.getAllHanghoas();

      return ApiResponse.success(
        res,
        hanghoas,
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
      const hanghoa = await this.hanghoaService.getHanghoaById(Number(id));

      return ApiResponse.success(
        res,
        hanghoa,
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
      const hanghoa = await this.hanghoaService.getHanghoaByMa(ma);

      return ApiResponse.success(
        res,
        hanghoa,
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

      if (!name || name.trim() === "") {
        const hanghoas = await this.hanghoaService.getAllHanghoas();
        return ApiResponse.success(
          res,
          hanghoas,
          "Danh sách hàng hóa",
          HttpStatus.OK
        );
      }

      const hanghoas = await this.hanghoaService.searchHanghoaByName(name);

      return ApiResponse.success(
        res,
        hanghoas,
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
      const hanghoa = await this.hanghoaService.createHanghoa(hanghoaData);

      return ApiResponse.success(
        res,
        hanghoa,
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
      const hanghoa = await this.hanghoaService.updateHanghoa(
        Number(id),
        hanghoaData
      );

      return ApiResponse.success(
        res,
        hanghoa,
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
      await this.hanghoaService.deleteHanghoa(Number(id));

      return ApiResponse.success(
        res,
        null,
        "Xóa hàng hóa thành công",
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  };
}
