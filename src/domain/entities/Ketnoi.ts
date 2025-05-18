import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("Ketnoi")
export class Ketnoi {
  @PrimaryGeneratedColumn({
    name: "ID",
    type: "numeric",
  })
  id!: number;

  @Column({ name: "Ten", type: "nvarchar", length: 255, nullable: true })
  ten!: string;

  @Column({ name: "Congcom", type: "nvarchar", length: 255, nullable: true })
  congcom!: string;

  @Column({ name: "Tocdo", type: "nvarchar", length: 255, nullable: true })
  tocdo!: string;

  @Column({ name: "Databit", type: "nvarchar", length: 255, nullable: true })
  databit!: string;

  @Column({ name: "Parity", type: "nvarchar", length: 255, nullable: true })
  parity!: string;

  @Column({ name: "Stopbit", type: "nvarchar", length: 255, nullable: true })
  stopbit!: string;

  @Column({ name: "Kytubatdau", type: "nvarchar", length: 255, nullable: true })
  kytubatdau!: string;

  @Column({ name: "Sokytutrongchuoi", type: "int", nullable: true })
  sokytutrongchuoi!: number;

  @Column({ name: "Chuoinguoc", type: "int", nullable: true })
  chuoinguoc!: number;

  @Column({ name: "Sokytuboqua", type: "int", nullable: true })
  sokytuboqua!: number;
}
