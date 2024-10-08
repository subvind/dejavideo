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
  @Render('diskJockeys/partials/video-options')
  async getVideoOptions(@Param('playlistId') playlistId: string): Promise<{ videos: YoutubeVideo[] }> {
    await this.youtubeVideosService.fetchAndSaveVideosFromPlaylist(playlistId);
    const videos = await this.youtubeVideosService.getVideosFromDatabase(playlistId);
    return { videos };
  }
}