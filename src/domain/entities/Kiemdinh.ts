import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("Kiemdinh")
export class Kiemdinh {
  @PrimaryGeneratedColumn({ name: "ID" })
  id!: number;

  @Column({ name: "Ngayhethan", type: "datetime", nullable: true })
  ngayhethan!: Date;

  @Column({ name: "Songaybaotruoc", type: "int", nullable: true })
  songaybaotruoc!: number;

  @Column({ name: "Ngaybaotri", type: "datetime", nullable: true })
  ngaybaotri!: Date;

  @Column({ name: "Songaybaotribaotruoc", type: "int", nullable: true })
  songaybaotribaotruoc!: number;

  @Column({ name: "Noidungbaotri", type: "nvarchar", nullable: true })
  noidungbaotri!: string;

  @Column({ name: "Noidungkhuyenmai", type: "nvarchar", nullable: true })
  noidungkhuyenmai!: string;

  @Column({ name: "Temp", type: "int", nullable: true })
  temp!: number;
}
