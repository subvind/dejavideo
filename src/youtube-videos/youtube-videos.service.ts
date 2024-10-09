import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { YoutubeVideo } from './youtube-video.entity';
import { google, youtube_v3 } from 'googleapis';

@Injectable()
export class YoutubeVideosService {
  private youtube: youtube_v3.Youtube;

  constructor(
    @InjectRepository(YoutubeVideo)
    private youtubeVideoRepository: Repository<YoutubeVideo>,
  ) {
    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      scopes: ['https://www.googleapis.com/auth/youtube.readonly'],
    });

    this.youtube = google.youtube({ version: 'v3', auth });
  }

  async saveVideo(videoData: Partial<YoutubeVideo>): Promise<YoutubeVideo> {
    const video = this.youtubeVideoRepository.create(videoData);
    return await this.youtubeVideoRepository.save(video);
  }

  async getVideosByUserId(userId: string): Promise<YoutubeVideo[]> {
    return await this.youtubeVideoRepository.find({ where: { userId } });
  }

  async getVideoById(videoId: string): Promise<YoutubeVideo> {
    return await this.youtubeVideoRepository.findOne({ where: { videoId } });
  }

  async getVideosByPlaylistId(playlistId: string): Promise<YoutubeVideo[]> {
    try {
      const response = await this.youtube.playlistItems.list({
        part: ['snippet'],
        playlistId: playlistId,
        maxResults: 50,
      });

      if (response.data.items && response.data.items.length > 0) {
        let videos: YoutubeVideo[] = [];
        response.data.items.map(async item => (
          videos.push(await this.saveVideo({
            videoId: item.snippet.resourceId.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            userId: '', // You might want to set this based on your application logic
            channelId: item.snippet.channelId,
            playlistId: playlistId,
          }))
        ));
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error fetching YouTube playlist videos:', error);
      throw new Error('Failed to fetch YouTube playlist videos');
    }
  }

  async fetchYoutubeVideoData(videoId: string): Promise<Partial<YoutubeVideo>> {
    try {
      const response = await this.youtube.videos.list({
        part: ['snippet'],
        id: [videoId],
      });

      if (response.data.items && response.data.items.length > 0) {
        const video = response.data.items[0];
        return {
          videoId: video.id,
          title: video.snippet.title,
          description: video.snippet.description,
          channelId: video.snippet.channelId,
        };
      } else {
        throw new Error('Video not found');
      }
    } catch (error) {
      console.error('Error fetching YouTube video data:', error);
      throw new Error('Failed to fetch YouTube video data');
    }
  }
}