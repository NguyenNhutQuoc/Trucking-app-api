import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("Form")
export class Form {
  @PrimaryGeneratedColumn({ name: "Form_ID" })
  formId!: number;

  @Column({ name: "Ten", type: "nvarchar", length: 255, nullable: true })
  ten!: string;

  @Column({ name: "Form", type: "nvarchar", length: 255, nullable: true })
  form!: string;

  @Column({ name: "Menuname", type: "nvarchar", length: 255, nullable: true })
  menuname!: string;

  @Column({ name: "Vitri", type: "nvarchar", length: 255, nullable: true })
  vitri!: string;
}
