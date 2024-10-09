import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { YoutubePlaylist } from './youtube-playlist.entity';
import { google, youtube_v3 } from 'googleapis';

@Injectable()
export class YoutubePlaylistService {
  private youtube: youtube_v3.Youtube;

  constructor(
    @InjectRepository(YoutubePlaylist)
    private youtubePlaylistRepository: Repository<YoutubePlaylist>,
  ) {
    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      scopes: ['https://www.googleapis.com/auth/youtube.readonly'],
    });

    this.youtube = google.youtube({ version: 'v3', auth });
  }

  async savePlaylist(playlistData: Partial<YoutubePlaylist>): Promise<YoutubePlaylist> {
    const playlist = this.youtubePlaylistRepository.create(playlistData);
    return await this.youtubePlaylistRepository.save(playlist);
  }

  async getPlaylistsByUserId(userId: string): Promise<YoutubePlaylist[]> {
    return await this.youtubePlaylistRepository.find({ where: { userId } });
  }

  async getPlaylistsFromDatabase(channelId: string): Promise<YoutubePlaylist[]> {
    let res = await this.youtubePlaylistRepository.find({ where: { userId: channelId } });

    // console.log('res', res);
    return res;
  }

  async fetchAndSavePlaylistsFromYoutube(channelId: string, userId: string): Promise<YoutubePlaylist[]> {
    try {
      const response = await this.youtube.playlists.list({
        part: ['snippet'],
        channelId: channelId,
        maxResults: 50,
      });

      if (response.data.items && response.data.items.length > 0) {
        const playlists: YoutubePlaylist[] = [];
        for (const playlist of response.data.items) {
          let existingPlaylist = await this.youtubePlaylistRepository.findOne({ where: { playlistId: playlist.id } });
          if (!existingPlaylist) {
            existingPlaylist = await this.savePlaylist({
              playlistId: playlist.id,
              title: playlist.snippet.title,
              description: playlist.snippet.description,
              userId: userId,
            });
          }
          playlists.push(existingPlaylist);
          // console.log('existingPlaylist', existingPlaylist);
        }
        return playlists;
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error fetching YouTube playlists:', error);
      throw new Error('Failed to fetch YouTube playlists');
    }
  }

  async getPlaylistsByChannelId(channelId: string, userId: string): Promise<YoutubePlaylist[]> {
    let playlists = await this.getPlaylistsFromDatabase(channelId);
    if (playlists.length === 0) {
      playlists = await this.fetchAndSavePlaylistsFromYoutube(channelId, userId);
    }
    return playlists;
  }
}