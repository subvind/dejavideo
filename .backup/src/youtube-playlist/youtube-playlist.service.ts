import { Injectable } from '@nestjs/common';
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

  async getPlaylistsByChannelId(channelId: string): Promise<YoutubePlaylist[]> {
    try {
      const response = await this.youtube.playlists.list({
        part: ['snippet'],
        channelId: channelId,
        maxResults: 50,
      });

      if (response.data.items && response.data.items.length > 0) {
        return response.data.items.map(playlist => ({
          playlistId: playlist.id,
          title: playlist.snippet.title,
          description: playlist.snippet.description,
          userId: '', // You might want to set this based on your application logic
        }));
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error fetching YouTube playlists:', error);
      throw new Error('Failed to fetch YouTube playlists');
    }
  }

  async fetchYoutubePlaylistData(playlistId: string): Promise<Partial<YoutubePlaylist>> {
    try {
      const response = await this.youtube.playlists.list({
        part: ['snippet'],
        id: [playlistId],
      });

      if (response.data.items && response.data.items.length > 0) {
        const playlist = response.data.items[0];
        return {
          playlistId: playlist.id,
          title: playlist.snippet.title,
          description: playlist.snippet.description,
        };
      } else {
        throw new Error('Playlist not found');
      }
    } catch (error) {
      console.error('Error fetching YouTube playlist data:', error);
      throw new Error('Failed to fetch YouTube playlist data');
    }
  }
}