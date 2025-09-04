import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from "typeorm";
import User from "../../users/models/user.model";
import Lesson from "../../lessons/models/Lesson";

@Entity("completions")
@Unique(["userId", "lessonId"])
export default class Completion {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @Column()
  lessonId!: number;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: User;

  @ManyToOne(() => Lesson, { onDelete: "CASCADE" })
  @JoinColumn({ name: "lessonId" })
  lesson!: Lesson;

  @Column({ type: "decimal", precision: 5, scale: 2, default: 100.00 })
  progressPercentage!: number; // 0.00 to 100.00

  @CreateDateColumn({ name: "completed_at" })
  completedAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}