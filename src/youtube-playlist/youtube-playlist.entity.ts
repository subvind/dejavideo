import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class YoutubePlaylist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  playlistId: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  userId: string;
}