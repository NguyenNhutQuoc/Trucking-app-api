// src/application/use-cases/MultiTenantAuthService.ts
import {
  IKhachHangTenantRepository,
  ITramCanRepository,
  IUserSessionRepository,
} from "../../domain/repositories/IMultiTenantRepositories";
import {
  UnauthorizedError,
  ValidationError,
  NotFoundError,
} from "../../utils/errors/AppError";
import { randomBytes } from "crypto";
import { addDays } from "date-fns";

export interface LoginRequest {
  maKhachHang: string;
  password: string;
}

export interface StationSelectionRequest {
  sessionToken: string;
  tramCanId: number;
}

export interface LoginResponse {
  sessionToken: string;
  khachHang: {
    id: number;
    maKhachHang: string;
    tenKhachHang: string;
  };
  tramCans: Array<{
    id: number;
    maTramCan: string;
    tenTramCan: string;
    diaChi: string;
  }>;
}

export interface StationSelectionResponse {
  sessionToken: string;
  selectedStation: {
    id: number;
    tenTramCan: string;
    dbConfig: any;
  };
  khachHang: {
    maKhachHang: string;
    tenKhachHang: string;
  };
}

export class MultiTenantAuthService {
  constructor(
    private khachHangTenantRepository: IKhachHangTenantRepository,
    private tramCanRepository: ITramCanRepository,
    private userSessionRepository: IUserSessionRepository
  ) {}

  /**
   * Step 1: Login với mã khách hàng và password
   * Trả về danh sách trạm cân để user chọn
   */
  async login(loginData: LoginRequest): Promise<LoginResponse> {
    const { maKhachHang, password } = loginData;

    // Validate input
    if (!maKhachHang?.trim() || !password?.trim()) {
      throw new ValidationError(
        "Mã khách hàng và mật khẩu không được để trống"
      );
    }

    // Authenticate khách hàng
    const khachHang = await this.khachHangTenantRepository.authenticate(
      maKhachHang,
      password
    );
    if (!khachHang) {
      throw new UnauthorizedError("Mã khách hàng hoặc mật khẩu không đúng");
    }

    if (khachHang.trangThai !== 1) {
      throw new UnauthorizedError("Tài khoản đã bị khóa");
    }

    // Lấy danh sách trạm cân của khách hàng
    const tramCans = await this.tramCanRepository.getByKhachHangId(
      khachHang.id
    );
    if (!tramCans.length) {
      throw new NotFoundError("Không tìm thấy trạm cân nào cho khách hàng này");
    }

    // Tạo session token tạm thời (chưa chọn trạm cân)
    const sessionToken = this.generateSessionToken();

    // Lưu session tạm (chưa có tramCanId)
    await this.userSessionRepository.createTempSession({
      sessionToken,
      khachHangId: khachHang.id,
      maKhachHang: khachHang.maKhachHang,
      tenKhachHang: khachHang.tenKhachHang,
      ngayHetHan: addDays(new Date(), 30), // 30 ngày
    });

    return {
      sessionToken,
      khachHang: {
        id: khachHang.id,
        maKhachHang: khachHang.maKhachHang,
        tenKhachHang: khachHang.tenKhachHang,
      },
      tramCans: tramCans.map((tc) => ({
        id: tc.id,
        maTramCan: tc.maTramCan,
        tenTramCan: tc.tenTramCan,
        diaChi: tc.diaChi,
      })),
    };
  }

  /**
   * Step 2: Chọn trạm cân và activate session
   */
  async selectStation(
    selectionData: StationSelectionRequest
  ): Promise<StationSelectionResponse> {
    const { sessionToken, tramCanId } = selectionData;

    // Validate session
    const tempSession = await this.userSessionRepository.getTempSession(
      sessionToken
    );
    if (!tempSession) {
      throw new UnauthorizedError("Session không hợp lệ hoặc đã hết hạn");
    }

    // Validate trạm cân
    const tramCan = await this.tramCanRepository.getById(tramCanId);
    if (!tramCan || tramCan.khachHangId !== tempSession.khachHangId) {
      throw new UnauthorizedError(
        "Trạm cân không hợp lệ hoặc không thuộc về khách hàng này"
      );
    }

    if (tramCan.trangThai !== 1) {
      throw new UnauthorizedError("Trạm cân đã bị vô hiệu hóa");
    }

    // Tạo database config
    const dbConfig = {
      host: tramCan.dbHost,
      port: tramCan.dbPort,
      database: tramCan.dbName,
      username: tramCan.dbUsername,
      password: tramCan.dbPassword,
      instanceName: tramCan.dbInstanceName,
    };

    // Tạo session hoàn chỉnh
    const newSessionToken = this.generateSessionToken();
    await this.userSessionRepository.createFullSession({
      sessionToken: newSessionToken,
      khachHangId: tempSession.khachHangId,
      tramCanId: tramCan.id,
      maKhachHang: tempSession.maKhachHang || "",
      tenKhachHang: tempSession.tenKhachHang || "",
      tenTramCan: tramCan.tenTramCan,
      currentDbConfig: JSON.stringify(dbConfig),
      ngayHetHan: addDays(new Date(), 30),
    });

    // Xóa temp session
    await this.userSessionRepository.deleteTempSession(sessionToken);

    return {
      sessionToken: newSessionToken,
      selectedStation: {
        id: tramCan.id,
        tenTramCan: tramCan.tenTramCan,
        dbConfig,
      },
      khachHang: {
        maKhachHang: tempSession.maKhachHang || "",
        tenKhachHang: tempSession.tenKhachHang || "",
      },
    };
  }

  /**
   * Validate session và lấy thông tin database config
   */
  async validateSession(sessionToken: string): Promise<{
    khachHang: { maKhachHang: string; tenKhachHang: string };
    tramCan: { id: number; tenTramCan: string };
    dbConfig: any;
  }> {
    const session = await this.userSessionRepository.getActiveSession(
      sessionToken
    );
    if (!session) {
      throw new UnauthorizedError("Session không hợp lệ hoặc đã hết hạn");
    }

    return {
      khachHang: {
        maKhachHang: session.maKhachHang,
        tenKhachHang: session.tenKhachHang,
      },
      tramCan: {
        id: session.tramCanId,
        tenTramCan: session.tenTramCan,
      },
      dbConfig: JSON.parse(session.currentDbConfig),
    };
  }

  /**
   * Logout - vô hiệu hóa session
   */
  async logout(sessionToken: string): Promise<boolean> {
    return await this.userSessionRepository.deactivateSession(sessionToken);
  }

  /**
   * Generate session token
   */
  private generateSessionToken(): string {
    return `session_${Date.now()}_${randomBytes(16).toString("hex")}`;
  }

  /**
   * Refresh session - gia hạn thời gian
   */
  async refreshSession(sessionToken: string): Promise<boolean> {
    const session = await this.userSessionRepository.getActiveSession(
      sessionToken
    );
    if (!session) {
      return false;
    }

    const newExpiry = addDays(new Date(), 30);
    return await this.userSessionRepository.updateSessionExpiry(
      sessionToken,
      newExpiry
    );
  }
}
