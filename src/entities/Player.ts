import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Session } from "./Session";

@Entity("player")
export class Player extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ default: 0 })
  high_score: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  score_updated_at: Date;

  @OneToMany(() => Session, (session) => session.player)
  sessions: Session[];
}
