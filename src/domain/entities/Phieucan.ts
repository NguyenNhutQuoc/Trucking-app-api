import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("Phieucan")
export class Phieucan {
  @PrimaryGeneratedColumn({
    name: "Stt",
    type: "numeric",
  })
  stt!: number;

  @Column({ name: "Sophieu", type: "int", nullable: true, default: 0 })
  sophieu!: number;

  @Column({ name: "Soxe", type: "nvarchar", length: 50, nullable: true })
  soxe!: string;

  @Column({ name: "Makh", type: "nvarchar", length: 255, nullable: true })
  makh!: string;

  @Column({ name: "Khachhang", type: "nvarchar", length: 50, nullable: true })
  khachhang!: string;

  @Column({ name: "Mahang", type: "nvarchar", length: 255, nullable: true })
  mahang!: string;

  @Column({ name: "Loaihang", type: "nvarchar", length: 50, nullable: true })
  loaihang!: string;

  @Column({
    name: "Ngaycan1",
    type: "datetime",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  ngaycan1!: Date;

  @Column({ name: "Ngaycan2", type: "datetime", nullable: true })
  ngaycan2!: Date;

  @Column({ name: "Tlcan1", type: "float", nullable: true, default: 0 })
  tlcan1!: number;

  @Column({ name: "Tlcan2", type: "float", nullable: true, default: 0 })
  tlcan2!: number;

  @Column({ name: "Xuatnhap", type: "nvarchar", length: 50, nullable: true })
  xuatnhap!: string;

  @Column({ name: "Ghichu", type: "nvarchar", length: 255, nullable: true })
  ghichu!: string;

  @Column({ name: "Nhanvien", type: "nvarchar", length: 255, nullable: true })
  nhanvien!: string;

  @Column({ name: "Kho", type: "nvarchar", length: 255, nullable: true })
  kho!: string;

  @Column({ name: "Sochungtu", type: "nvarchar", length: 255, nullable: true })
  sochungtu!: string;

  @Column({ name: "UploadStatus", type: "int", nullable: true, default: 0 })
  uploadStatus!: number;
}
