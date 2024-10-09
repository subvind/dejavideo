import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { YoutubePlaylistService } from './youtube-playlist.service';
import { YoutubePlaylist } from './youtube-playlist.entity';

@Controller('youtube-playlists')
export class YoutubePlaylistController {
  constructor(private readonly youtubePlaylistService: YoutubePlaylistService) {}

  @Post()
  async createPlaylist(@Body() playlistData: Partial<YoutubePlaylist>): Promise<YoutubePlaylist> {
    return this.youtubePlaylistService.savePlaylist(playlistData);
  }

  @Get(':userId')
  async getPlaylistsByUserId(@Param('userId') userId: string): Promise<YoutubePlaylist[]> {
    return this.youtubePlaylistService.getPlaylistsByUserId(userId);
  }
}