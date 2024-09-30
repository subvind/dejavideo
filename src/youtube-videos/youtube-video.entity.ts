import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class YoutubeVideo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  videoId: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  userId: string;

  @Column()
  channelId: string;

  @Column({ nullable: true })
  playlistId: string;
}