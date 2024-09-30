import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { VideoTimelineService } from './video-timeline.service';
import { VideoTimelineEntry } from './video-timeline-entry.entity';

@Controller('video-timeline')
export class VideoTimelineController {
  constructor(private videoTimelineService: VideoTimelineService) {}

  @Post()
  async addVideoToTimeline(
    @Body() body: { videoId: string; userId: string; publishDateTime: string },
  ): Promise<VideoTimelineEntry> {
    const { videoId, userId, publishDateTime } = body;
    return await this.videoTimelineService.addVideoToTimeline(
      videoId,
      userId,
      new Date(publishDateTime),
    );
  }

  @Get(':userId')
  async getTimelineForUser(@Param('userId') userId: string): Promise<VideoTimelineEntry[]> {
    return await this.videoTimelineService.getTimelineForUser(userId);
  }
}