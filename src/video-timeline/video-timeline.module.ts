import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoTimelineEntry } from './video-timeline-entry.entity';
import { VideoTimelineService } from './video-timeline.service';
import { VideoTimelineController } from './video-timeline.controller';
import { YoutubeVideosModule } from '../youtube-videos/youtube-videos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([VideoTimelineEntry]),
    YoutubeVideosModule,
  ],
  providers: [VideoTimelineService],
  controllers: [VideoTimelineController],
  exports: [VideoTimelineService],
})
export class VideoTimelineModule {}