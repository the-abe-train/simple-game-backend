import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Score } from "./Score";
import { Session } from "./Session";

@Entity("player")
export class Player extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToOne(() => Score)
  @JoinColumn({name: "score_id"})
  score: Score

  @OneToMany(() => Session, session => session.player)
  sessions: Session[]
}
