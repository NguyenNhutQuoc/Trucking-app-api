import {
  INhomQuyenRepository,
  IQuyenRepository,
} from "../../domain/repositories/IRepositoryInterfaces";
import { NhomQuyen } from "../../domain/entities/NhomQuyen";
import { NotFoundError, ValidationError } from "../../utils/errors/AppError";

export class NhomQuyenService {
  constructor(
    private nhomQuyenRepository: INhomQuyenRepository,
    private quyenRepository: IQuyenRepository
  ) {}

  async getAllNhomQuyens(): Promise<NhomQuyen[]> {
    return this.nhomQuyenRepository.getAll();
  }

  async getNhomQuyenById(id: number): Promise<NhomQuyen> {
    const nhomQuyen = await this.nhomQuyenRepository.getById(id);
    if (!nhomQuyen) {
      throw new NotFoundError(`Nhóm quyền với ID ${id} không tồn tại`);
    }
    return nhomQuyen;
  }

  async getNhomQuyenWithPermissions(id: number): Promise<any> {
    const nhomQuyen = await this.nhomQuyenRepository.getWithPermissions(id);
    if (!nhomQuyen) {
      throw new NotFoundError(`Nhóm quyền với ID ${id} không tồn tại`);
    }
    return nhomQuyen;
  }

  async createNhomQuyen(nhomQuyenData: Partial<NhomQuyen>): Promise<NhomQuyen> {
    // Validation
    if (!nhomQuyenData.ma) {
      throw new ValidationError("Mã nhóm quyền không được để trống");
    }

    if (!nhomQuyenData.ten) {
      throw new ValidationError("Tên nhóm quyền không được để trống");
    }

    return this.nhomQuyenRepository.create(nhomQuyenData);
  }

  async updateNhomQuyen(
    id: number,
    nhomQuyenData: Partial<NhomQuyen>
  ): Promise<NhomQuyen> {
    const nhomQuyen = await this.nhomQuyenRepository.getById(id);
    if (!nhomQuyen) {
      throw new NotFoundError(`Nhóm quyền với ID ${id} không tồn tại`);
    }

    const updatedNhomQuyen = await this.nhomQuyenRepository.update(
      id,
      nhomQuyenData
    );
    if (!updatedNhomQuyen) {
      throw new Error("Cập nhật nhóm quyền thất bại");
    }

    return updatedNhomQuyen;
  }

  async deleteNhomQuyen(id: number): Promise<boolean> {
    const nhomQuyen = await this.nhomQuyenRepository.getById(id);
    if (!nhomQuyen) {
      throw new NotFoundError(`Nhóm quyền với ID ${id} không tồn tại`);
    }

    return this.nhomQuyenRepository.delete(id);
  }

  async addPermissionToGroup(nhomId: number, formId: number): Promise<any> {
    const nhomQuyen = await this.nhomQuyenRepository.getById(nhomId);
    if (!nhomQuyen) {
      throw new NotFoundError(`Nhóm quyền với ID ${nhomId} không tồn tại`);
    }

    return this.quyenRepository.addPermission(nhomId, formId);
  }

  async removePermissionFromGroup(
    nhomId: number,
    formId: number
  ): Promise<boolean> {
    const nhomQuyen = await this.nhomQuyenRepository.getById(nhomId);
    if (!nhomQuyen) {
      throw new NotFoundError(`Nhóm quyền với ID ${nhomId} không tồn tại`);
    }

    return this.quyenRepository.removePermission(nhomId, formId);
  }

  async updateGroupPermissions(
    nhomId: number,
    formIds: number[]
  ): Promise<boolean> {
    const nhomQuyen = await this.nhomQuyenRepository.getById(nhomId);
    if (!nhomQuyen) {
      throw new NotFoundError(`Nhóm quyền với ID ${nhomId} không tồn tại`);
    }

    // Get current permissions
    const currentPermissions = await this.quyenRepository.getByNhomId(nhomId);
    const currentFormIds = currentPermissions.map((p) => p.formId);

    // Determine which permissions to add and which to remove
    const toAdd = formIds.filter((id) => !currentFormIds.includes(id));
    const toRemove = currentFormIds.filter((id) => !formIds.includes(id));

    // Add new permissions
    for (const formId of toAdd) {
      await this.quyenRepository.addPermission(nhomId, formId);
    }

    // Remove permissions
    for (const formId of toRemove) {
      await this.quyenRepository.removePermission(nhomId, formId);
    }

    return true;
  }
}
