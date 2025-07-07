// src/infrastructure/repositories/KhachHangTenantRepository.ts
import { Repository } from "typeorm";
import { KhachHangTenant } from "../../domain/entities/KhachHangTenant";
import { IKhachHangTenantRepository } from "../../domain/repositories/IMultiTenantRepositories";
import { AppDataSource } from "../../config/database"; // Master database

export class KhachHangTenantRepository implements IKhachHangTenantRepository {
  private repository: Repository<KhachHangTenant>;

  constructor() {
    this.repository = AppDataSource.getRepository(KhachHangTenant);
  }

  async authenticate(
    maKhachHang: string,
    password: string
  ): Promise<KhachHangTenant | null> {
    return this.repository.findOne({
      where: {
        maKhachHang,
        password, // In production, should hash password
        trangThai: 1,
      },
    });
  }

  async getById(id: number): Promise<KhachHangTenant | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  async getByMaKhachHang(maKhachHang: string): Promise<KhachHangTenant | null> {
    return this.repository.findOne({
      where: { maKhachHang },
    });
  }

  async create(data: Partial<KhachHangTenant>): Promise<KhachHangTenant> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(
    id: number,
    data: Partial<KhachHangTenant>
  ): Promise<KhachHangTenant | null> {
    await this.repository.update(id, data);
    return this.getById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
