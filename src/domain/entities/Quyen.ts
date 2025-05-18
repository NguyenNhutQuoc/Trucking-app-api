import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { NhomQuyen } from "./NhomQuyen";
import { Form } from "./Form";

@Entity("Quyen")
export class Quyen {
  @PrimaryGeneratedColumn({
    name: "Quyen_ID",
    type: "numeric",
  })
  quyenId!: number;

  @Column({ name: "Nhom_ID", type: "int", nullable: true })
  nhomId!: number;

  @Column({ name: "Form_ID", type: "int", nullable: true })
  formId!: number;

  @ManyToOne(() => NhomQuyen, { nullable: true })
  @JoinColumn({ name: "Nhom_ID" })
  nhomQuyen!: NhomQuyen;

  @ManyToOne(() => Form, { nullable: true })
  @JoinColumn({ name: "Form_ID" })
  form!: Form;
}
