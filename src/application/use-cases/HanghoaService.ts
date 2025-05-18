import { IHanghoaRepository } from "../../domain/repositories/IRepositoryInterfaces";
import { Hanghoa } from "../../domain/entities/Hanghoa";
import { NotFoundError, ValidationError } from "../../utils/errors/AppError";

export class HanghoaService {
  constructor(private hanghoaRepository: IHanghoaRepository) {}

  async getAllHanghoas(): Promise<Hanghoa[]> {
    return this.hanghoaRepository.getAll();
  }

  async getHanghoaById(id: number): Promise<Hanghoa> {
    const hanghoa = await this.hanghoaRepository.getById(id);
    if (!hanghoa) {
      throw new NotFoundError(`Hàng hóa với ID ${id} không tồn tại`);
    }
    return hanghoa;
  }

  async getHanghoaByMa(ma: string): Promise<Hanghoa> {
    const hanghoa = await this.hanghoaRepository.getByMa(ma);
    if (!hanghoa) {
      throw new NotFoundError(`Hàng hóa với mã ${ma} không tồn tại`);
    }
    return hanghoa;
  }

  async searchHanghoaByName(name: string): Promise<Hanghoa[]> {
    return this.hanghoaRepository.searchByName(name);
  }

  async createHanghoa(hanghoaData: Partial<Hanghoa>): Promise<Hanghoa> {
    // Validation
    if (!hanghoaData.ma) {
      throw new ValidationError("Mã hàng hóa không được để trống");
    }

    if (!hanghoaData.ten) {
      throw new ValidationError("Tên hàng hóa không được để trống");
    }

    // Check if the product code already exists
    const existingProduct = await this.hanghoaRepository.getByMa(
      hanghoaData.ma
    );
    if (existingProduct) {
      throw new ValidationError(`Mã hàng hóa ${hanghoaData.ma} đã tồn tại`);
    }

    // Set default value for dongia if not provided
    if (hanghoaData.dongia === undefined) {
      hanghoaData.dongia = 0;
    }

    return this.hanghoaRepository.create(hanghoaData);
  }

  async updateHanghoa(
    id: number,
    hanghoaData: Partial<Hanghoa>
  ): Promise<Hanghoa> {
    const hanghoa = await this.hanghoaRepository.getById(id);
    if (!hanghoa) {
      throw new NotFoundError(`Hàng hóa với ID ${id} không tồn tại`);
    }

    // If updating the product code, check if it already exists (not considering the current product)
    if (hanghoaData.ma && hanghoaData.ma !== hanghoa.ma) {
      const existingProduct = await this.hanghoaRepository.getByMa(
        hanghoaData.ma
      );
      if (existingProduct && existingProduct.id !== id) {
        throw new ValidationError(`Mã hàng hóa ${hanghoaData.ma} đã tồn tại`);
      }
    }

    const updatedHanghoa = await this.hanghoaRepository.update(id, hanghoaData);
    if (!updatedHanghoa) {
      throw new Error("Cập nhật hàng hóa thất bại");
    }

    return updatedHanghoa;
  }

  async deleteHanghoa(id: number): Promise<boolean> {
    const hanghoa = await this.hanghoaRepository.getById(id);
    if (!hanghoa) {
      throw new NotFoundError(`Hàng hóa với ID ${id} không tồn tại`);
    }

    return this.hanghoaRepository.delete(id);
  }
}
