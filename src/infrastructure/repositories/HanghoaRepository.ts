import { Repository, getRepository, Like } from "typeorm";
import { Hanghoa } from "../../domain/entities/Hanghoa";
import { IHanghoaRepository } from "../../domain/repositories/IRepositoryInterfaces";
import { AppDataSource } from "../../config/database";

export class HanghoaRepository implements IHanghoaRepository {
  private repository: Repository<Hanghoa>;

  constructor() {
    this.repository = AppDataSource.getRepository(Hanghoa);
  }

  async getAll(): Promise<Hanghoa[]> {
    return this.repository.find({
      order: {
        ma: "ASC",
      },
    });
  }

  async getById(id: number): Promise<Hanghoa | null> {
    return this.repository.findOne({
      where: { id: id },
    });
  }

  async create(item: Partial<Hanghoa>): Promise<Hanghoa> {
    const hanghoa = this.repository.create(item);
    return this.repository.save(hanghoa);
  }

  async update(id: number, item: Partial<Hanghoa>): Promise<Hanghoa | null> {
    await this.repository.update(id, item);
    return this.repository.findOne({
      where: { id: id },
    });
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async getByMa(ma: string): Promise<Hanghoa | null> {
    return this.repository.findOne({
      where: { ma: ma },
    });
  }

  async searchByName(name: string): Promise<Hanghoa[]> {
    return this.repository.find({
      where: {
        ten: Like(`%${name}%`),
      },
      order: {
        ten: "ASC",
      },
    });
  }
}
