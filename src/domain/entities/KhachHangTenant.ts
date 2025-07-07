// src/domain/entities/KhachHangTenant.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { TramCan } from "./TramCan";

@Entity("KhachHangTenants")
export class KhachHangTenant {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "maKhachHang", type: "nvarchar", length: 50, unique: true })
  maKhachHang!: string;

  @Column({ name: "tenKhachHang", type: "nvarchar", length: 255 })
  tenKhachHang!: string;

  @Column({ name: "password", type: "nvarchar", length: 255 })
  password!: string;

  @Column({ name: "trangThai", type: "int", default: 1 })
  trangThai!: number;

  @Column({ name: "ngayTao", type: "datetime", default: () => "GETDATE()" })
  ngayTao!: Date;

  @Column({ name: "ngayCapNhat", type: "datetime", default: () => "GETDATE()" })
  ngayCapNhat!: Date;

  @Column({ name: "ghiChu", type: "nvarchar", length: 500, nullable: true })
  ghiChu!: string;

  @OneToMany(() => TramCan, (tramCan) => tramCan.khachHang)
  tramCans!: TramCan[];
}
