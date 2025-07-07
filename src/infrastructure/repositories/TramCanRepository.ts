// src/infrastructure/repositories/TramCanRepository.ts
import { Repository } from "typeorm";
import { TramCan } from "../../domain/entities/TramCan";
import { ITramCanRepository } from "../../domain/repositories/IMultiTenantRepositories";
import { AppDataSource } from "../../config/database";

export class TramCanRepository implements ITramCanRepository {
  private repository: Repository<TramCan>;

  constructor() {
    this.repository = AppDataSource.getRepository(TramCan);
  }
  async getAll(): Promise<TramCan[]> {
    return this.repository.find({
      order: {
        tenTramCan: "ASC",
      },
    });
  }

  async getById(id: number): Promise<TramCan | null> {
    return this.repository.findOne({
      where: { id },
      relations: ["khachHang"],
    });
  }

  async getByKhachHangId(khachHangId: number): Promise<TramCan[]> {
    return this.repository.find({
      where: {
        khachHangId,
        trangThai: 1,
      },
      order: {
        tenTramCan: "ASC",
      },
    });
  }

  async getByMaTramCan(
    khachHangId: number,
    maTramCan: string
  ): Promise<TramCan | null> {
    return this.repository.findOne({
      where: {
        khachHangId,
        maTramCan,
      },
    });
  }

  async create(data: Partial<TramCan>): Promise<TramCan> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: number, data: Partial<TramCan>): Promise<TramCan | null> {
    await this.repository.update(id, data);
    return this.getById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
