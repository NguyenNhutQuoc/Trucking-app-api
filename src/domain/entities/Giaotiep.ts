import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("Giaotiep")
export class Giaotiep {
  @PrimaryGeneratedColumn({ name: "ID" })
  id!: number;

  @Column({ name: "tencty", type: "nvarchar", length: 255, nullable: true })
  tencty!: string;

  @Column({ name: "diachi", type: "nvarchar", length: 255, nullable: true })
  diachi!: string;

  @Column({ name: "dienthoai", type: "nvarchar", length: 255, nullable: true })
  dienthoai!: string;

  @Column({ name: "nguoican", type: "nvarchar", length: 255, nullable: true })
  nguoican!: string;

  @Column({ name: "Chieucaogiay", type: "float", nullable: true })
  chieucaogiay!: number;

  @Column({ name: "Sotrangin", type: "int", nullable: true })
  sotrangin!: number;

  @Column({ name: "Kieuin", type: "nvarchar", length: 255, nullable: true })
  kieuin!: string;

  @Column({ name: "Cachtrai", type: "float", nullable: true })
  cachtrai!: number;

  @Column({ name: "Cachtren", type: "float", nullable: true })
  cachtren!: number;

  @Column({ name: "Khogiay", type: "int", nullable: true })
  khogiay!: number;

  @Column({ name: "Sophieuin", type: "int", nullable: true })
  sophieuin!: number;
}
