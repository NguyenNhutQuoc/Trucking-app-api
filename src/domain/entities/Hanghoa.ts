import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("Hanghoa")
export class Hanghoa {
  @PrimaryGeneratedColumn({
    name: "ID",
    type: "numeric",
  })
  id!: number;

  @Column({ name: "Ma", type: "nvarchar", length: 255, nullable: true })
  ma!: string;

  @Column({ name: "Ten", type: "nvarchar", length: 50, nullable: true })
  ten!: string;

  @Column({ name: "Dongia", type: "float", nullable: true, default: 0 })
  dongia!: number;
}
