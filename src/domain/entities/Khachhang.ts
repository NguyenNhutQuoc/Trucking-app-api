import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
@Entity("Khachhang")
export class Khachhang {
  @PrimaryGeneratedColumn({
    name: "ID",
    type: "numeric",
  })
  id!: number;

  @Column({ name: "Ma", type: "nvarchar", length: 255, nullable: true })
  ma!: string;

  @Column({ name: "Ten", type: "nvarchar", length: 255, nullable: true })
  ten!: string;

  @Column({ name: "Diachi", type: "nvarchar", length: 255, nullable: true })
  diachi!: string;

  @Column({ name: "Dienthoai", type: "nvarchar", length: 255, nullable: true })
  dienthoai!: string;
}
