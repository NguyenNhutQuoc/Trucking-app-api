import { Repository, getRepository } from "typeorm";
import { NhomQuyen } from "../../domain/entities/NhomQuyen";
import { INhomQuyenRepository } from "../../domain/repositories/IRepositoryInterfaces";
import { AppDataSource } from "../../config/database";

export class NhomQuyenRepository implements INhomQuyenRepository {
  private repository: Repository<NhomQuyen>;

  constructor() {
    this.repository = AppDataSource.getRepository(NhomQuyen);
  }

  async getAll(): Promise<NhomQuyen[]> {
    return this.repository.find({
      order: {
        ten: "ASC",
      },
    });
  }

  async getById(id: number): Promise<NhomQuyen | null> {
    return this.repository.findOne({
      where: { nhomId: id },
    });
  }

  async create(item: Partial<NhomQuyen>): Promise<NhomQuyen> {
    const nhomQuyen = this.repository.create(item);
    return this.repository.save(nhomQuyen);
  }

  async update(
    id: number,
    item: Partial<NhomQuyen>
  ): Promise<NhomQuyen | null> {
    await this.repository.update(id, item);
    return this.repository.findOne({
      where: { nhomId: id },
    });
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async getWithPermissions(nhomId: number): Promise<any> {
    const nhomQuyen = await this.repository.findOne({
      where: { nhomId },
    });

    if (!nhomQuyen) {
      return null;
    }

    // Get all permissions for this group
    const permissions = await getRepository("Quyen")
      .createQueryBuilder("quyen")
      .innerJoinAndSelect("quyen.form", "form")
      .where("quyen.nhomId = :nhomId", { nhomId })
      .getMany();

    return {
      ...nhomQuyen,
      permissions,
    };
  }
}
