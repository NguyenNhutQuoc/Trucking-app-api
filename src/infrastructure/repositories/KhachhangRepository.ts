import { Repository, getRepository, Like } from "typeorm";
import { Khachhang } from "../../domain/entities/Khachhang";
import { IKhachhangRepository } from "../../domain/repositories/IRepositoryInterfaces";
import { AppDataSource } from "../../config/database";

export class KhachhangRepository implements IKhachhangRepository {
  private repository: Repository<Khachhang>;

  constructor() {
    this.repository = AppDataSource.getRepository(Khachhang);
  }

  async getAll(): Promise<Khachhang[]> {
    return this.repository.find({
      order: {
        ten: "ASC",
      },
    });
  }

  async getById(id: number): Promise<Khachhang | null> {
    return this.repository.findOne({
      where: { id: id },
    });
  }

  async create(item: Partial<Khachhang>): Promise<Khachhang> {
    const khachhang = this.repository.create(item);
    return this.repository.save(khachhang);
  }

  async update(
    id: number,
    item: Partial<Khachhang>
  ): Promise<Khachhang | null> {
    await this.repository.update(id, item);
    return this.repository.findOne({
      where: { id: id },
    });
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async getByMa(ma: string): Promise<Khachhang | null> {
    return this.repository.findOne({
      where: { ma: ma },
    });
  }

  async searchByName(name: string): Promise<Khachhang[]> {
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
