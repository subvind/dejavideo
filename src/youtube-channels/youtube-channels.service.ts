import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
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
    if (!channelData.title) {
      if (channelData.channelId) {
        try {
          const fetchedData = await this.fetchYoutubeChannelData(channelData.channelId);
          channelData.title = fetchedData.title;
        } catch (error) {
          if (error instanceof NotFoundException) {
            throw new BadRequestException('Channel not found');
          }
          throw error;
        }
      } else {
        throw new BadRequestException('Channel title or channelId is required');
      }
    }

    if (!channelData.title) {
      throw new BadRequestException('Failed to fetch channel title');
    }

    const channelAlreadyExists = await this.youtubeChannelRepository.find({ where: { channelId: channelData.channelId } })
    if (channelAlreadyExists.length > 0) {
      throw new BadRequestException('Channel already exists in the database.');
    }

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
        throw new NotFoundException('Channel not found');
      }
    } catch (error) {
      console.error('Error fetching YouTube channel data:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to fetch YouTube channel data');
    }
  }
}