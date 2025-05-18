import { Request, Response, NextFunction } from "express";
import { NhomQuyenService } from "../../application/use-cases/NhomQuyenService";
import { HttpStatus } from "../../utils/httpStatus";
import { ApiResponse } from "../../utils/apiResponse";

export class NhomQuyenController {
  constructor(private nhomQuyenService: NhomQuyenService) {}

  getAllNhomQuyens = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const nhomQuyens = await this.nhomQuyenService.getAllNhomQuyens();

      return ApiResponse.success(
        res,
        nhomQuyens,
        "Danh sách nhóm quyền",
        HttpStatus.OK
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
      const { id } = req.params;
      const nhomQuyen = await this.nhomQuyenService.getNhomQuyenById(
        Number(id)
      );

      return ApiResponse.success(
        res,
        nhomQuyen,
        "Chi tiết nhóm quyền",
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  };

  getNhomQuyenWithPermissions = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const nhomQuyen = await this.nhomQuyenService.getNhomQuyenWithPermissions(
        Number(id)
      );

      return ApiResponse.success(
        res,
        nhomQuyen,
        "Chi tiết nhóm quyền và quyền",
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  };

  createNhomQuyen = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const nhomQuyenData = req.body;
      const nhomQuyen = await this.nhomQuyenService.createNhomQuyen(
        nhomQuyenData
      );

      return ApiResponse.success(
        res,
        nhomQuyen,
        "Tạo nhóm quyền thành công",
        HttpStatus.CREATED
      );
    } catch (error) {
      next(error);
    }
  };

  updateNhomQuyen = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const nhomQuyenData = req.body;
      const nhomQuyen = await this.nhomQuyenService.updateNhomQuyen(
        Number(id),
        nhomQuyenData
      );

      return ApiResponse.success(
        res,
        nhomQuyen,
        "Cập nhật nhóm quyền thành công",
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  };

  deleteNhomQuyen = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.nhomQuyenService.deleteNhomQuyen(Number(id));

      return ApiResponse.success(
        res,
        null,
        "Xóa nhóm quyền thành công",
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  };

  addPermissionToGroup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { nhomId, formId } = req.params;
      const permission = await this.nhomQuyenService.addPermissionToGroup(
        Number(nhomId),
        Number(formId)
      );

      return ApiResponse.success(
        res,
        permission,
        "Thêm quyền thành công",
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  };

  removePermissionFromGroup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { nhomId, formId } = req.params;
      await this.nhomQuyenService.removePermissionFromGroup(
        Number(nhomId),
        Number(formId)
      );

      return ApiResponse.success(
        res,
        null,
        "Xóa quyền thành công",
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  };

  updateGroupPermissions = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { nhomId } = req.params;
      const { formIds } = req.body;

      if (!Array.isArray(formIds)) {
        return ApiResponse.error(
          res,
          "formIds phải là một mảng các ID",
          HttpStatus.BAD_REQUEST
        );
      }

      await this.nhomQuyenService.updateGroupPermissions(
        Number(nhomId),
        formIds
      );

      return ApiResponse.success(
        res,
        null,
        "Cập nhật quyền thành công",
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  };
}
