import { Repository, getRepository } from "typeorm";
import { Quyen } from "../../domain/entities/Quyen";
import { IQuyenRepository } from "../../domain/repositories/IRepositoryInterfaces";
import { AppDataSource } from "../../config/database";

export class QuyenRepository implements IQuyenRepository {
  private repository: Repository<Quyen>;

  constructor() {
    this.repository = AppDataSource.getRepository(Quyen);
  }

  async getAll(): Promise<Quyen[]> {
    return this.repository.find({
      relations: ["nhomQuyen", "form"],
    });
  }

  async getById(id: number): Promise<Quyen | null> {
    return this.repository.findOne({
      where: { quyenId: id },
      relations: ["nhomQuyen", "form"],
    });
  }

  async create(item: Partial<Quyen>): Promise<Quyen> {
    const quyen = this.repository.create(item);
    return this.repository.save(quyen);
  }

  async update(id: number, item: Partial<Quyen>): Promise<Quyen | null> {
    await this.repository.update(id, item);
    return this.repository.findOne({
      where: { quyenId: id },
      relations: ["nhomQuyen", "form"],
    });
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async getByNhomId(nhomId: number): Promise<Quyen[]> {
    return this.repository.find({
      where: { nhomId },
      relations: ["form"],
    });
  }

  async addPermission(nhomId: number, formId: number): Promise<Quyen> {
    // Check if permission already exists
    const existingPermission = await this.repository.findOne({
      where: {
        nhomId,
        formId,
      },
    });

    if (existingPermission) {
      return existingPermission;
    }

    // Create new permission
    const newPermission = this.repository.create({
      nhomId,
      formId,
    });

    return this.repository.save(newPermission);
  }

  async removePermission(nhomId: number, formId: number): Promise<boolean> {
    const result = await this.repository.delete({
      nhomId,
      formId,
    });

    return (result.affected ?? 0) > 0;
  }
}
