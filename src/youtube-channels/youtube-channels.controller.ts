import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { YoutubeChannelsService } from './youtube-channels.service';
import { YoutubeChannel } from './youtube-channel.entity';

@Controller('youtube-channels')
export class YoutubeChannelsController {
  constructor(private readonly youtubeChannelsService: YoutubeChannelsService) {}

  @Post()
  async createChannel(@Body() channelData: Partial<YoutubeChannel>): Promise<YoutubeChannel> {
    return this.youtubeChannelsService.saveChannel(channelData);
  }

  @Get(':userId')
  async getChannelsByUserId(@Param('userId') userId: string): Promise<YoutubeChannel[]> {
    return this.youtubeChannelsService.getChannelsByUserId(userId);
  }
}