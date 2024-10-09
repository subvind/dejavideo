import { Controller, Post, Body, Get, Param, Render } from '@nestjs/common';
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

  @Get('options/:playlistId')
  @Render('partials/video-options')
  async getVideoOptions(@Param('playlistId') playlistId: string): Promise<{ videos: YoutubeVideo[] }> {
    const videos = await this.youtubeVideosService.getVideosByPlaylistId(playlistId);
    return { videos };
  }
}