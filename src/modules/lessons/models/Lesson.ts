import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import Module from "../../modules/models/Module";

@Entity("lessons")
export default class Lesson {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255 })
  title!: string;

  @Column({ type: "text", nullable: true })
  content!: string;

  @Column()
  moduleId!: number;

  @ManyToOne(() => Module, { onDelete: "CASCADE" })
  @JoinColumn({ name: "moduleId" })
  module!: Module;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}