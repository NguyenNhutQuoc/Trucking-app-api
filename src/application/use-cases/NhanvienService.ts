import { INhanvienRepository } from "../../domain/repositories/IRepositoryInterfaces";
import { Nhanvien } from "../../domain/entities/Nhanvien";
import { NotFoundError, ValidationError } from "../../utils/errors/AppError";

export class NhanvienService {
  constructor(private nhanvienRepository: INhanvienRepository) {}

  async getAllNhanviens(): Promise<Nhanvien[]> {
    return this.nhanvienRepository.getAll();
  }

  async getNhanvienById(nvId: string): Promise<Nhanvien> {
    const nhanvien = await this.nhanvienRepository.getById(nvId);
    if (!nhanvien)
      throw new NotFoundError(`Nhân viên với ID ${nvId} không tồn tại`);
    return nhanvien;
  }

  async createNhanvien(data: Partial<Nhanvien>): Promise<Nhanvien> {
    if (!data.nvId)
      throw new ValidationError("Mã nhân viên không được để trống");
    if (!data.tenNV)
      throw new ValidationError("Tên nhân viên không được để trống");
    if (!data.matkhau)
      throw new ValidationError("Mật khẩu không được để trống");
    // ...add more validation if needed...
    return this.nhanvienRepository.create(data);
  }

  async updateNhanvien(
    nvId: string,
    data: Partial<Nhanvien>
  ): Promise<Nhanvien> {
    const nhanvien = await this.nhanvienRepository.getById(nvId);
    if (!nhanvien)
      throw new NotFoundError(`Nhân viên với ID ${nvId} không tồn tại`);
    return this.nhanvienRepository.update(nvId, data);
  }

  async deleteNhanvien(nvId: string): Promise<boolean> {
    const nhanvien = await this.nhanvienRepository.getById(nvId);
    if (!nhanvien)
      throw new NotFoundError(`Nhân viên với ID ${nvId} không tồn tại`);
    return this.nhanvienRepository.delete(nvId);
  }
}
