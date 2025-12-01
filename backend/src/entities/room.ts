import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: "int" })
  capacity: number;
}
