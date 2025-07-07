// src/domain/entities/UserSession.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { KhachHangTenant } from "./KhachHangTenant";
import { TramCan } from "./TramCan";

@Entity("UserSessions")
export class UserSession {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "sessionToken", type: "nvarchar", length: 255, unique: true })
  sessionToken!: string;

  @Column({ name: "khachHangId", type: "int" })
  khachHangId!: number;

  @Column({ name: "tramCanId", type: "int" })
  tramCanId!: number;

  @Column({ name: "maKhachHang", type: "nvarchar", length: 50 })
  maKhachHang!: string;

  @Column({ name: "tenKhachHang", type: "nvarchar", length: 255 })
  tenKhachHang!: string;

  @Column({ name: "tenTramCan", type: "nvarchar", length: 255 })
  tenTramCan!: string;

  @Column({ name: "currentDbConfig", type: "nvarchar", length: "MAX" })
  currentDbConfig!: string; // JSON string

  @Column({ name: "ngayTao", type: "datetime", default: () => "GETDATE()" })
  ngayTao!: Date;

  @Column({ name: "ngayHetHan", type: "datetime" })
  ngayHetHan!: Date;

  @Column({ name: "trangThai", type: "int", default: 1 })
  trangThai!: number;

  @ManyToOne(() => KhachHangTenant)
  @JoinColumn({ name: "khachHangId" })
  khachHang!: KhachHangTenant;

  @ManyToOne(() => TramCan)
  @JoinColumn({ name: "tramCanId" })
  tramCan!: TramCan;
}
