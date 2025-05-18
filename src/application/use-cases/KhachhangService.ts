import { IKhachhangRepository } from "../../domain/repositories/IRepositoryInterfaces";
import { Khachhang } from "../../domain/entities/Khachhang";
import { NotFoundError, ValidationError } from "../../utils/errors/AppError";

export class KhachhangService {
  constructor(private khachhangRepository: IKhachhangRepository) {}

  async getAllKhachhangs(): Promise<Khachhang[]> {
    return this.khachhangRepository.getAll();
  }

  async getKhachhangById(id: number): Promise<Khachhang> {
    const khachhang = await this.khachhangRepository.getById(id);
    if (!khachhang) {
      throw new NotFoundError(`Khách hàng với ID ${id} không tồn tại`);
    }
    return khachhang;
  }

  async getKhachhangByMa(ma: string): Promise<Khachhang> {
    const khachhang = await this.khachhangRepository.getByMa(ma);
    if (!khachhang) {
      throw new NotFoundError(`Khách hàng với mã ${ma} không tồn tại`);
    }
    return khachhang;
  }

  async searchKhachhangByName(name: string): Promise<Khachhang[]> {
    return this.khachhangRepository.searchByName(name);
  }

  async createKhachhang(khachhangData: Partial<Khachhang>): Promise<Khachhang> {
    // Validation
    if (!khachhangData.ma) {
      throw new ValidationError("Mã khách hàng không được để trống");
    }

    if (!khachhangData.ten) {
      throw new ValidationError("Tên khách hàng không được để trống");
    }

    // Check if the customer code already exists
    const existingCustomer = await this.khachhangRepository.getByMa(
      khachhangData.ma
    );
    if (existingCustomer) {
      throw new ValidationError(`Mã khách hàng ${khachhangData.ma} đã tồn tại`);
    }

    return this.khachhangRepository.create(khachhangData);
  }

  async updateKhachhang(
    id: number,
    khachhangData: Partial<Khachhang>
  ): Promise<Khachhang> {
    const khachhang = await this.khachhangRepository.getById(id);
    if (!khachhang) {
      throw new NotFoundError(`Khách hàng với ID ${id} không tồn tại`);
    }

    // If updating the customer code, check if it already exists (not considering the current customer)
    if (khachhangData.ma && khachhangData.ma !== khachhang.ma) {
      const existingCustomer = await this.khachhangRepository.getByMa(
        khachhangData.ma
      );
      if (existingCustomer && existingCustomer.id !== id) {
        throw new ValidationError(
          `Mã khách hàng ${khachhangData.ma} đã tồn tại`
        );
      }
    }

    const updatedKhachhang = await this.khachhangRepository.update(
      id,
      khachhangData
    );
    if (!updatedKhachhang) {
      throw new Error("Cập nhật khách hàng thất bại");
    }

    return updatedKhachhang;
  }

  async deleteKhachhang(id: number): Promise<boolean> {
    const khachhang = await this.khachhangRepository.getById(id);
    if (!khachhang) {
      throw new NotFoundError(`Khách hàng với ID ${id} không tồn tại`);
    }

    return this.khachhangRepository.delete(id);
  }
}
