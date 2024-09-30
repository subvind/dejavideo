import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { YoutubeVideo } from '../youtube-videos/youtube-video.entity';

@Entity()
export class VideoTimelineEntry {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => YoutubeVideo)
  video: YoutubeVideo;

  @Column()
  userId: string;

  @Column()
  publishDateTime: Date;
}