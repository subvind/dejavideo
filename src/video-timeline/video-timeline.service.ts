import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VideoTimelineEntry } from './video-timeline-entry.entity';
import { YoutubeVideosService } from '../youtube-videos/youtube-videos.service';

@Injectable()
export class VideoTimelineService {
  constructor(
    @InjectRepository(VideoTimelineEntry)
    private videoTimelineRepository: Repository<VideoTimelineEntry>,
    private youtubeVideosService: YoutubeVideosService,
  ) {}

  async addVideoToTimeline(videoId: string, userId: string, publishDateTime: Date): Promise<VideoTimelineEntry> {
    const video = await this.youtubeVideosService.getVideoById(videoId);
    if (!video) {
      throw new Error('Video not found');
    }

    const timelineEntry = this.videoTimelineRepository.create({
      video,
      userId,
      publishDateTime,
    });

    return await this.videoTimelineRepository.save(timelineEntry);
  }

  async getTimelineForUser(userId: string): Promise<VideoTimelineEntry[]> {
    return await this.videoTimelineRepository.find({
      where: { userId },
      relations: ['video'],
      order: { publishDateTime: 'ASC' },
    });
  }
}