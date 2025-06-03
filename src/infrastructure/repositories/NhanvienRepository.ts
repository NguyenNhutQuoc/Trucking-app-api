import { Repository } from "typeorm";
import { Nhanvien } from "../../domain/entities/Nhanvien";
import { INhanvienRepository } from "../../domain/repositories/IRepositoryInterfaces";
import { compare, hash } from "bcryptjs";
import { AppDataSource } from "../../config/database";

export class NhanvienRepository implements INhanvienRepository {
  private repository: Repository<Nhanvien>;

  constructor() {
    this.repository = AppDataSource.getRepository(Nhanvien);
  }

  async getAll(): Promise<Nhanvien[]> {
    return this.repository.find({
      relations: ["nhomQuyen"],
      order: {
        tenNV: "ASC",
      },
    });
  }

  async getById(id: string): Promise<Nhanvien | null> {
    return this.repository.findOne({
      where: { nvId: id },
      relations: ["nhomQuyen"],
    });
  }

  async create(item: Partial<Nhanvien>): Promise<Nhanvien> {
    // Hash password if provided
    if (item.matkhau) {
      item.matkhau = await hash(item.matkhau, 10);
    }

    const nhanvien = this.repository.create(item);
    return this.repository.save(nhanvien);
  }

  async update(id: string, item: Partial<Nhanvien>): Promise<Nhanvien | null> {
    // If updating password, hash it
    if (item.matkhau) {
      item.matkhau = await hash(item.matkhau, 10);
    }

    await this.repository.update(id, item);
    return this.repository.findOne({
      where: { nvId: id },
      relations: ["nhomQuyen"],
    });
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async authenticate(
    username: string,
    password: string
  ): Promise<Nhanvien | null> {
    const user = await this.repository.findOne({
      where: { nvId: username },
      relations: ["nhomQuyen"],
    });

    console.log("Authenticating user:", user);

    if (!user) {
      return null;
    }

    // For simplicity in this example, we're checking plaintext passwords
    // In a real application, you should use proper password hashing
    if (user.matkhau === password) {
      return user;
    }

    return null;
  }

  async getWithPermissions(nvId: string): Promise<any> {
    // Custom query to get user with all permissions
    const user = await this.repository.findOne({
      where: { nvId },
      relations: ["nhomQuyen"],
    });

    if (!user || !user.nhomQuyen) {
      return user;
    }

    // Get all permissions for the user's group
    const permissions = await AppDataSource.getRepository("Quyen")
      .createQueryBuilder("quyen")
      .innerJoinAndSelect("quyen.form", "form")
      .where("quyen.nhomId = :nhomId", { nhomId: user.nhomId })
      .getMany();

    return {
      ...user,
      permissions,
    };
  }
}
