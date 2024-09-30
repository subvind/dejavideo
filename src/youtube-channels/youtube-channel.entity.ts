import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class YoutubeChannel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  channelId: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  userId: string;
}