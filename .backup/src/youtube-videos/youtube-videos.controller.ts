import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { YoutubeVideosService } from './youtube-videos.service';
import { YoutubeVideo } from './youtube-video.entity';

@Controller('youtube-videos')
export class YoutubeVideosController {
  constructor(private readonly youtubeVideosService: YoutubeVideosService) {}

  @Post()
  async createVideo(@Body() videoData: Partial<YoutubeVideo>): Promise<YoutubeVideo> {
    return this.youtubeVideosService.saveVideo(videoData);
  }

  @Get(':userId')
  async getVideosByUserId(@Param('userId') userId: string): Promise<YoutubeVideo[]> {
    return this.youtubeVideosService.getVideosByUserId(userId);
  }
}