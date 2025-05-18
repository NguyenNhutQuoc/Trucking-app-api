import { ISoxeRepository } from "../../domain/repositories/IRepositoryInterfaces";
import { Soxe } from "../../domain/entities/Soxe";
import { NotFoundError, ValidationError } from "../../utils/errors/AppError";

export class SoxeService {
  constructor(private soxeRepository: ISoxeRepository) {}

  async getAllSoxes(): Promise<Soxe[]> {
    return this.soxeRepository.getAll();
  }

  async getSoxeById(id: number): Promise<Soxe> {
    const soxe = await this.soxeRepository.getById(id);
    if (!soxe) {
      throw new NotFoundError(`Số xe với ID ${id} không tồn tại`);
    }
    return soxe;
  }

  async getSoxeBySoxe(soxe: string): Promise<Soxe> {
    const result = await this.soxeRepository.getBySoxe(soxe);
    if (!result) {
      throw new NotFoundError(`Số xe ${soxe} không tồn tại`);
    }
    return result;
  }

  async createSoxe(soxeData: Partial<Soxe>): Promise<Soxe> {
    // Validation
    if (!soxeData.soxe) {
      throw new ValidationError("Số xe không được để trống");
    }

    // Check if the vehicle number already exists
    const existingVehicle = await this.soxeRepository.getBySoxe(soxeData.soxe);
    if (existingVehicle) {
      throw new ValidationError(`Số xe ${soxeData.soxe} đã tồn tại`);
    }

    // Set default value for trongluong if not provided
    if (soxeData.trongluong === undefined) {
      soxeData.trongluong = 0;
    }

    return this.soxeRepository.create(soxeData);
  }

  async updateSoxe(id: number, soxeData: Partial<Soxe>): Promise<Soxe> {
    const soxe = await this.soxeRepository.getById(id);
    if (!soxe) {
      throw new NotFoundError(`Số xe với ID ${id} không tồn tại`);
    }

    // If updating the vehicle number, check if it already exists (not considering the current vehicle)
    if (soxeData.soxe && soxeData.soxe !== soxe.soxe) {
      const existingVehicle = await this.soxeRepository.getBySoxe(
        soxeData.soxe
      );
      if (existingVehicle && existingVehicle.id !== id) {
        throw new ValidationError(`Số xe ${soxeData.soxe} đã tồn tại`);
      }
    }

    const updatedSoxe = await this.soxeRepository.update(id, soxeData);
    if (!updatedSoxe) {
      throw new Error("Cập nhật số xe thất bại");
    }

    return updatedSoxe;
  }

  async deleteSoxe(id: number): Promise<boolean> {
    const soxe = await this.soxeRepository.getById(id);
    if (!soxe) {
      throw new NotFoundError(`Số xe với ID ${id} không tồn tại`);
    }

    return this.soxeRepository.delete(id);
  }
}
