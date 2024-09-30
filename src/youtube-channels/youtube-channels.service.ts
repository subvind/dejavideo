import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { YoutubeChannel } from './youtube-channel.entity';
import { google, youtube_v3 } from 'googleapis';

@Injectable()
export class YoutubeChannelsService {
  private youtube: youtube_v3.Youtube;

  constructor(
    @InjectRepository(YoutubeChannel)
    private youtubeChannelRepository: Repository<YoutubeChannel>,
  ) {
    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      scopes: ['https://www.googleapis.com/auth/youtube.readonly'],
    });

    this.youtube = google.youtube({ version: 'v3', auth });
  }

  async saveChannel(channelData: Partial<YoutubeChannel>): Promise<YoutubeChannel> {
    const channel = this.youtubeChannelRepository.create(channelData);
    return await this.youtubeChannelRepository.save(channel);
  }

  async getChannelsByUserId(userId: string): Promise<YoutubeChannel[]> {
    return await this.youtubeChannelRepository.find({ where: { userId } });
  }

  async fetchYoutubeChannelData(channelId: string): Promise<Partial<YoutubeChannel>> {
    try {
      const response = await this.youtube.channels.list({
        part: ['snippet'],
        id: [channelId],
      });

      if (response.data.items && response.data.items.length > 0) {
        const channel = response.data.items[0];
        return {
          channelId: channel.id,
          title: channel.snippet.title,
          description: channel.snippet.description,
        };
      } else {
        throw new Error('Channel not found');
      }
    } catch (error) {
      console.error('Error fetching YouTube channel data:', error);
      throw new Error('Failed to fetch YouTube channel data');
    }
  }
}