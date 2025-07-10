// src/domain/repositories/IMultiTenantRepositories.ts
import { KhachHangTenant } from "../entities/KhachHangTenant";
import { TramCan } from "../entities/TramCan";
import { UserSession } from "../entities/UserSession";
import { IGenericRepository } from "./IRepositoryInterfaces";

export interface IKhachHangTenantRepository {
  authenticate(
    maKhachHang: string,
    password: string
  ): Promise<KhachHangTenant | null>;
  getById(id: number): Promise<KhachHangTenant | null>;
  getByMaKhachHang(maKhachHang: string): Promise<KhachHangTenant | null>;
  create(data: Partial<KhachHangTenant>): Promise<KhachHangTenant>;
  update(
    id: number,
    data: Partial<KhachHangTenant>
  ): Promise<KhachHangTenant | null>;
  delete(id: number): Promise<boolean>;
}

export interface ITramCanRepository extends IGenericRepository<any> {
  getById(id: number): Promise<TramCan | null>;
  getByKhachHangId(khachHangId: number): Promise<TramCan[]>;
  getByMaTramCan(
    khachHangId: number,
    maTramCan: string
  ): Promise<TramCan | null>;
  create(data: Partial<TramCan>): Promise<TramCan>;
  update(id: number, data: Partial<TramCan>): Promise<TramCan | null>;
  delete(id: number): Promise<boolean>;
}

export interface IUserSessionRepository {
  createTempSession(data: {
    sessionToken: string;
    khachHangId: number;
    maKhachHang: string;
    tenKhachHang: string;
    ngayHetHan: Date;
  }): Promise<UserSession>;

  createFullSession(data: {
    sessionToken: string;
    khachHangId: number;
    tramCanId: number;
    maKhachHang: string;
    tenKhachHang: string;
    tenTramCan: string;
    currentDbConfig: string;
    ngayHetHan: Date;
  }): Promise<UserSession>;

  getSessionByToken(sessionToken: string): Promise<UserSession | null>;
  getTempSession(sessionToken: string): Promise<Partial<UserSession> | null>;
  getActiveSession(sessionToken: string): Promise<UserSession | null>;
  deleteTempSession(sessionToken: string): Promise<boolean>;
  deactivateSession(sessionToken: string): Promise<boolean>;
  updateSessionExpiry(sessionToken: string, newExpiry: Date): Promise<boolean>;
  cleanupExpiredSessions(): Promise<number>;
}
