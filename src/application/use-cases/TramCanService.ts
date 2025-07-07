// src/application/use-cases/TramCanService.ts
import {
  ITramCanRepository,
  IUserSessionRepository,
} from "../../domain/repositories/IMultiTenantRepositories";
import { TramCan } from "../../domain/entities/TramCan";
import {
  NotFoundError,
  ValidationError,
  UnauthorizedError,
} from "../../utils/errors/AppError";
import { MultiTenantAuthService } from "./MultiTenantAuthService";

export class TramCanService {
  constructor(
    private tramCanRepository: ITramCanRepository,
    private userSessionRepository: IUserSessionRepository,
    private authService: MultiTenantAuthService
  ) {}

  async getAllTramCans(): Promise<TramCan[]> {
    return this.tramCanRepository.getAll();
  }

  async getTramCansByKhachHang(khachHangId: number): Promise<TramCan[]> {
    return this.tramCanRepository.getByKhachHangId(khachHangId);
  }

  async getTramCanById(id: number): Promise<TramCan> {
    const tramCan = await this.tramCanRepository.getById(id);
    if (!tramCan) {
      throw new NotFoundError(`Trạm cân với ID ${id} không tồn tại`);
    }
    return tramCan;
  }

  async getSessionInfo(sessionToken: string): Promise<any> {
    const session = await this.userSessionRepository.getActiveSession(
      sessionToken
    );
    if (!session) {
      throw new UnauthorizedError("Session không hợp lệ hoặc đã hết hạn");
    }

    return {
      khachHangId: session.khachHangId,
      khachHang: {
        maKhachHang: session.maKhachHang,
        tenKhachHang: session.tenKhachHang,
      },
      tramCan: session.tramCanId
        ? {
            id: session.tramCanId,
            tenTramCan: session.tenTramCan,
          }
        : null,
    };
  }

  async switchStation(sessionToken: string, tramCanId: number): Promise<any> {
    // Validate current session
    const currentSession = await this.userSessionRepository.getActiveSession(
      sessionToken
    );
    if (!currentSession) {
      throw new UnauthorizedError("Session không hợp lệ");
    }

    // Validate new station belongs to same customer
    const newTramCan = await this.tramCanRepository.getById(tramCanId);
    if (!newTramCan || newTramCan.khachHangId !== currentSession.khachHangId) {
      throw new UnauthorizedError("Trạm cân không thuộc về khách hàng này");
    }

    // Use existing selectStation method from AuthService
    return this.authService.selectStation({
      sessionToken,
      tramCanId,
    });
  }

  async createTramCan(tramCanData: Partial<TramCan>): Promise<TramCan> {
    // Validation
    if (!tramCanData.khachHangId) {
      throw new ValidationError("ID khách hàng không được để trống");
    }
    if (!tramCanData.tenTramCan) {
      throw new ValidationError("Tên trạm cân không được để trống");
    }
    if (!tramCanData.dbHost || !tramCanData.dbName) {
      throw new ValidationError("Thông tin database không được để trống");
    }

    return this.tramCanRepository.create(tramCanData);
  }

  async updateTramCan(
    id: number,
    tramCanData: Partial<TramCan>
  ): Promise<TramCan> {
    const tramCan = await this.tramCanRepository.getById(id);
    if (!tramCan) {
      throw new NotFoundError(`Trạm cân với ID ${id} không tồn tại`);
    }

    const updatedTramCan = await this.tramCanRepository.update(id, tramCanData);
    if (!updatedTramCan) {
      throw new Error("Cập nhật trạm cân thất bại");
    }

    return updatedTramCan;
  }

  async deleteTramCan(id: number): Promise<boolean> {
    const tramCan = await this.tramCanRepository.getById(id);
    if (!tramCan) {
      throw new NotFoundError(`Trạm cân với ID ${id} không tồn tại`);
    }

    return this.tramCanRepository.delete(id);
  }
}
