import {
  Repository,
  Between,
  MoreThanOrEqual,
  LessThanOrEqual,
  Like,
  IsNull,
  Not,
  getRepository,
} from "typeorm";
import { Phieucan } from "../../domain/entities/Phieucan";
import { IPhieucanRepository } from "../../domain/repositories/IRepositoryInterfaces";
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  format,
  subDays,
} from "date-fns";
import { AppDataSource } from "../../config/database";

export class PhieucanRepository implements IPhieucanRepository {
  private repository: Repository<Phieucan>;

  constructor() {
    this.repository = AppDataSource.getRepository(Phieucan);
  }

  async getAll(): Promise<Phieucan[]> {
    return this.repository.find({
      order: {
        sophieu: "DESC",
      },
    });
  }

  async getById(id: number): Promise<Phieucan | null> {
    return this.repository.findOne({
      where: { stt: id },
    });
  }

  async create(item: Partial<Phieucan>): Promise<Phieucan> {
    const phieuCan = this.repository.create(item);
    return this.repository.save(phieuCan);
  }

  async update(id: number, item: Partial<Phieucan>): Promise<Phieucan | null> {
    await this.repository.update(id, item);
    return this.repository.findOne({
      where: { stt: id },
    });
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async getByDateRange(startDate: Date, endDate: Date): Promise<Phieucan[]> {
    return this.repository.find({
      where: {
        ngaycan1: Between(startOfDay(startDate), endOfDay(endDate)),
      },
      order: {
        ngaycan1: "DESC",
      },
    });
  }

  async getBySoxe(soxe: string): Promise<Phieucan[]> {
    return this.repository.find({
      where: {
        soxe: soxe,
      },
      order: {
        ngaycan1: "DESC",
      },
    });
  }

  async getByStatus(status: number): Promise<Phieucan[]> {
    return this.repository.find({
      where: {
        uploadStatus: status,
      },
      order: {
        ngaycan1: "DESC",
      },
    });
  }

  async countByDateRange(startDate: Date, endDate: Date): Promise<number> {
    return this.repository.count({
      where: {
        ngaycan1: Between(startOfDay(startDate), endOfDay(endDate)),
      },
    });
  }

  async sumWeightByDateRange(startDate: Date, endDate: Date): Promise<number> {
    const result = await this.repository
      .createQueryBuilder("phieucan")
      .select("SUM(ABS(phieucan.tlcan1 - phieucan.tlcan2))", "totalWeight")
      .where("phieucan.ngaycan1 BETWEEN :startDate AND :endDate", {
        startDate: startOfDay(startDate),
        endDate: endOfDay(endDate),
      })
      .andWhere("phieucan.ngaycan2 IS NOT NULL")
      .getRawOne();

    return result?.totalWeight || 0;
  }

  async getByMahang(mahang: string): Promise<Phieucan[]> {
    return this.repository.find({
      where: {
        mahang: mahang,
      },
      order: {
        ngaycan1: "DESC",
      },
    });
  }

  async getByKhachhang(makh: string): Promise<Phieucan[]> {
    return this.repository.find({
      where: {
        makh: makh,
      },
      order: {
        ngaycan1: "DESC",
      },
    });
  }

  async getCompleted(): Promise<Phieucan[]> {
    return this.repository.find({
      where: {
        ngaycan2: Not(IsNull()),
        uploadStatus: 0,
      },
      order: {
        ngaycan1: "DESC",
      },
    });
  }

  async getPending(): Promise<Phieucan[]> {
    return this.repository.find({
      where: {
        ngaycan2: IsNull(),
        uploadStatus: 0,
      },
      order: {
        ngaycan1: "DESC",
      },
    });
  }

  async getCanceledOrDeleted(): Promise<Phieucan[]> {
    return this.repository.find({
      where: {
        uploadStatus: Not(0),
      },
      order: {
        ngaycan1: "DESC",
      },
    });
  }

  async getTodayRecords(): Promise<Phieucan[]> {
    const today = new Date();
    return this.repository.find({
      where: {
        ngaycan1: Between(startOfDay(today), endOfDay(today)),
      },
      order: {
        ngaycan1: "DESC",
      },
    });
  }

  async getWeightStatisticsByCompany(): Promise<any[]> {
    return this.repository
      .createQueryBuilder("phieucan")
      .select("phieucan.khachhang", "companyName")
      .addSelect("COUNT(phieucan.stt)", "weighCount")
      .addSelect("SUM(ABS(phieucan.tlcan1 - phieucan.tlcan2))", "totalWeight")
      .where("phieucan.ngaycan2 IS NOT NULL")
      .groupBy("phieucan.khachhang")
      .orderBy("totalWeight", "DESC")
      .getRawMany();
  }

  async getWeightStatisticsByProduct(): Promise<any[]> {
    return this.repository
      .createQueryBuilder("phieucan")
      .select("phieucan.loaihang", "productName")
      .addSelect("COUNT(phieucan.stt)", "weighCount")
      .addSelect("SUM(ABS(phieucan.tlcan1 - phieucan.tlcan2))", "totalWeight")
      .where("phieucan.ngaycan2 IS NOT NULL")
      .groupBy("phieucan.loaihang")
      .orderBy("totalWeight", "DESC")
      .getRawMany();
  }

  async getWeightStatisticsByVehicle(): Promise<any[]> {
    return this.repository
      .createQueryBuilder("phieucan")
      .select("phieucan.soxe", "vehicleNumber")
      .addSelect("COUNT(phieucan.stt)", "weighCount")
      .addSelect("SUM(ABS(phieucan.tlcan1 - phieucan.tlcan2))", "totalWeight")
      .addSelect("AVG(ABS(phieucan.tlcan1 - phieucan.tlcan2))", "averageWeight")
      .where("phieucan.ngaycan2 IS NOT NULL")
      .groupBy("phieucan.soxe")
      .orderBy("weighCount", "DESC")
      .getRawMany();
  }

  async getWeightStatisticsByDay(
    startDate: Date,
    endDate: Date
  ): Promise<any[]> {
    return this.repository
      .createQueryBuilder("phieucan")
      .select(`FORMAT(phieucan.ngaycan1, 'yyyy-MM-dd')`, "date")
      .addSelect("COUNT(phieucan.stt)", "weighCount")
      .addSelect("SUM(ABS(phieucan.tlcan1 - phieucan.tlcan2))", "totalWeight")
      .where("phieucan.ngaycan1 BETWEEN :startDate AND :endDate", {
        startDate: startOfDay(startDate),
        endDate: endOfDay(endDate),
      })
      .andWhere("phieucan.ngaycan2 IS NOT NULL")
      .groupBy(`FORMAT(phieucan.ngaycan1, 'yyyy-MM-dd')`)
      .orderBy("date", "ASC")
      .getRawMany();
  }
}
