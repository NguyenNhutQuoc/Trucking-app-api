// src/infrastructure/repositories/UserSessionRepository.ts
import { Repository } from "typeorm";
import { UserSession } from "../../domain/entities/UserSession";
import { IUserSessionRepository } from "../../domain/repositories/IMultiTenantRepositories";
import { AppDataSource } from "../../config/database";

export class UserSessionRepository implements IUserSessionRepository {
  private repository: Repository<UserSession>;

  constructor() {
    this.repository = AppDataSource.getRepository(UserSession);
  }
  getSessionByToken(sessionToken: string): Promise<UserSession | null> {
    return this.repository.findOne({
      where: { sessionToken },
    });
  }

  async createTempSession(data: {
    sessionToken: string;
    khachHangId: number;
    maKhachHang: string;
    tenKhachHang: string;
    ngayHetHan: Date;
  }): Promise<UserSession> {
    const entity = this.repository.create({
      ...data,
      tramCanId: 0, // Temp session chưa có trạm cân
      tenTramCan: "",
      currentDbConfig: "",
      trangThai: 0, // 0 = temp, 1 = active
    });
    return this.repository.save(entity);
  }

  async createFullSession(data: {
    sessionToken: string;
    khachHangId: number;
    tramCanId: number;
    maKhachHang: string;
    tenKhachHang: string;
    tenTramCan: string;
    currentDbConfig: string;
    ngayHetHan: Date;
  }): Promise<UserSession> {
    const entity = this.repository.create({
      ...data,
      trangThai: 1, // 1 = active
    });
    return this.repository.save(entity);
  }

  async getTempSession(
    sessionToken: string
  ): Promise<Partial<UserSession> | null> {
    return this.repository.findOne({
      where: {
        sessionToken,
        trangThai: 0, // temp session
      },
      select: ["khachHangId", "maKhachHang", "tenKhachHang", "ngayHetHan"],
    });
  }

  async getActiveSession(sessionToken: string): Promise<UserSession | null> {
    return this.repository.findOne({
      where: {
        sessionToken,
        trangThai: 1, // active session
      },
    });
  }

  async deleteTempSession(sessionToken: string): Promise<boolean> {
    const result = await this.repository.delete({
      sessionToken,
      trangThai: 0,
    });
    return (result.affected ?? 0) > 0;
  }

  async deactivateSession(sessionToken: string): Promise<boolean> {
    const result = await this.repository.update(
      { sessionToken },
      { trangThai: -1 } // -1 = deactivated
    );
    return (result.affected ?? 0) > 0;
  }

  async updateSessionExpiry(
    sessionToken: string,
    newExpiry: Date
  ): Promise<boolean> {
    const result = await this.repository.update(
      { sessionToken, trangThai: 1 },
      { ngayHetHan: newExpiry }
    );
    return (result.affected ?? 0) > 0;
  }

  async cleanupExpiredSessions(): Promise<number> {
    const result = await this.repository.delete({
      ngayHetHan: new Date(), // Less than current date
    });
    return result.affected ?? 0;
  }
}
