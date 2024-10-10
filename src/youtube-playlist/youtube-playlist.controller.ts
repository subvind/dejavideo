import { Controller, Post, Body, Get, Param, Render } from '@nestjs/common';
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

  @Get('options/:channelId')
  @Render('diskJockeys/partials/playlist-options')
  async getPlaylistOptions(@Param('channelId') channelId: string): Promise<{ playlists: YoutubePlaylist[] }> {
    await this.youtubePlaylistService.fetchAndSavePlaylistsFromYoutube(channelId, channelId);
    const playlists = await this.youtubePlaylistService.getPlaylistsFromDatabase(channelId);
    return { playlists };
  }
}