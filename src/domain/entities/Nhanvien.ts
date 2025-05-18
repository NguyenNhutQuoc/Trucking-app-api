import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { NhomQuyen } from "./NhomQuyen";

@Entity("Nhanvien")
export class Nhanvien {
  @PrimaryColumn({ name: "NV_ID", type: "nvarchar", length: 255 })
  nvId!: string;

  @Column({ name: "TenNV", type: "nvarchar", length: 255, nullable: true })
  tenNV!: string;

  @Column({ name: "Matkhau", type: "nvarchar", length: 255, nullable: true })
  matkhau!: string;

  @Column({ name: "Trangthai", type: "int", nullable: true })
  trangthai!: number;

  @Column({ name: "Type", type: "int", nullable: true })
  type!: number;

  @Column({ name: "Nhom_id", type: "int", nullable: true })
  nhomId!: number;

  @ManyToOne(() => NhomQuyen, { nullable: true })
  @JoinColumn({ name: "Nhom_id" })
  nhomQuyen!: NhomQuyen;
}
