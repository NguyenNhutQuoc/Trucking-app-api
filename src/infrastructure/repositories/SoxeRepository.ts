import { Repository, getRepository, Like } from "typeorm";
import { Soxe } from "../../domain/entities/Soxe";
import { ISoxeRepository } from "../../domain/repositories/IRepositoryInterfaces";
import { AppDataSource } from "../../config/database";

export class SoxeRepository implements ISoxeRepository {
  private repository: Repository<Soxe>;

  constructor() {
    this.repository = AppDataSource.getRepository(Soxe);
  }

  async getAll(): Promise<Soxe[]> {
    return this.repository.find({
      order: {
        soxe: "ASC",
      },
    });
  }

  async getById(id: number): Promise<Soxe | null> {
    return this.repository.findOne({
      where: { id: id },
    });
  }

  async create(item: Partial<Soxe>): Promise<Soxe> {
    const soxe = this.repository.create(item);
    return this.repository.save(soxe);
  }

  async update(id: number, item: Partial<Soxe>): Promise<Soxe | null> {
    await this.repository.update(id, item);
    return this.repository.findOne({
      where: { id: id },
    });
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async getBySoxe(soxe: string): Promise<Soxe | null> {
    return this.repository.findOne({
      where: { soxe: soxe },
    });
  }
}
