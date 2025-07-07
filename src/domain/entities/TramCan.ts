// src/domain/entities/TramCan.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { KhachHangTenant } from "./KhachHangTenant";

@Entity("TramCan")
export class TramCan {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "khachHangId", type: "int" })
  khachHangId!: number;

  @Column({ name: "maTramCan", type: "nvarchar", length: 50 })
  maTramCan!: string;

  @Column({ name: "tenTramCan", type: "nvarchar", length: 255 })
  tenTramCan!: string;

  @Column({ name: "diaChi", type: "nvarchar", length: 500, nullable: true })
  diaChi!: string;

  @Column({ name: "dbHost", type: "nvarchar", length: 255 })
  dbHost!: string;

  @Column({ name: "dbPort", type: "int", default: 1433 })
  dbPort!: number;

  @Column({ name: "dbName", type: "nvarchar", length: 100 })
  dbName!: string;

  @Column({ name: "dbUsername", type: "nvarchar", length: 100 })
  dbUsername!: string;

  @Column({ name: "dbPassword", type: "nvarchar", length: 255 })
  dbPassword!: string;

  @Column({
    name: "dbInstanceName",
    type: "nvarchar",
    length: 50,
    nullable: true,
  })
  dbInstanceName!: string;

  @Column({ name: "trangThai", type: "int", default: 1 })
  trangThai!: number;

  @Column({ name: "ngayTao", type: "datetime", default: () => "GETDATE()" })
  ngayTao!: Date;

  @Column({ name: "ngayCapNhat", type: "datetime", default: () => "GETDATE()" })
  ngayCapNhat!: Date;

  @ManyToOne(() => KhachHangTenant, (khachHang) => khachHang.tramCans)
  @JoinColumn({ name: "khachHangId" })
  khachHang!: KhachHangTenant;
}
