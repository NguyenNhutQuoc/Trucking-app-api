import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("NhomQuyen")
export class NhomQuyen {
  @PrimaryGeneratedColumn({
    name: "Nhom_id",
    type: "numeric",
  })
  nhomId!: number;

  @Column({ name: "Ma", type: "nvarchar", length: 255, nullable: true })
  ma!: string;

  @Column({ name: "Ten", type: "nvarchar", length: 255, nullable: true })
  ten!: string;
}
