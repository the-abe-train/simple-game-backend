import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Player } from "./Player";

@Entity("session")
export class Session extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  session_token: string;

  @Column()
  valid: boolean;

  @Column()
  user_agent: string;

  @Column()
  ip: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Player, (player) => player.sessions, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "player_id" })
  player: Player;
}
