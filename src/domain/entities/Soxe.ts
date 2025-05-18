import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("Soxe")
export class Soxe {
  @PrimaryGeneratedColumn({
    name: "id",
    type: "numeric",
  })
  id!: number;

  @Column({ name: "Soxe", type: "nvarchar", length: 255, nullable: true })
  soxe!: string;

  @Column({ name: "Trongluong", type: "float", nullable: true })
  trongluong!: number;
}
