import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("Temp")
export class Temp {
  @PrimaryColumn({ name: "ID", type: "nvarchar", length: 255 })
  id!: string;

  @Column({ name: "ValueI", type: "nvarchar", length: 255, nullable: true })
  valueI!: string;

  @Column({ name: "ValueN", type: "nvarchar", length: 255, nullable: true })
  valueN!: string;

  @Column({ name: "ValueU", type: "nvarchar", length: 255, nullable: true })
  valueU!: string;

  @Column({ name: "ValueP", type: "nvarchar", length: 255, nullable: true })
  valueP!: string;

  @Column({ name: "Status", type: "nvarchar", length: 255, nullable: true })
  status!: string;

  @Column({ name: "Syntime", type: "float", nullable: true })
  syntime!: number;
}
