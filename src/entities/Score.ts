import {
  BaseEntity,
  Column,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("score")
export class Score extends BaseEntity {
  @PrimaryColumn()
  username: string;

  @Column()
  score: number;

  @UpdateDateColumn()
  updated_at: Date;
}
