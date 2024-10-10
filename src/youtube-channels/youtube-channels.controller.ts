import { Controller, Post, Body, Get, Param, Render } from '@nestjs/common';
import { YoutubeChannelsService } from './youtube-channels.service';
import { YoutubeChannel } from './youtube-channel.entity';

@Controller('youtube-channels')
export class YoutubeChannelsController {
  constructor(private readonly youtubeChannelsService: YoutubeChannelsService) {}

  @Post()
  async createChannel(@Body() channelData: Partial<YoutubeChannel>): Promise<YoutubeChannel> {
    return this.youtubeChannelsService.saveChannel(channelData);
  }

  @Get('options/:userId')
  @Render('diskJockeys/partials/channel-options')
  async getChannelOptions(@Param('userId') userId: string): Promise<{ channels: YoutubeChannel[] }> {
    const channels = await this.youtubeChannelsService.getChannelsByUserId(userId);
    return { channels };
  }

  @Get('list/:userId')
  @Render('diskJockeys/partials/channel-list')
  async getChannelList(@Param('userId') userId: string): Promise<{ channels: YoutubeChannel[] }> {
    const channels = await this.youtubeChannelsService.getChannelsByUserId(userId);
    return { channels };
  }
}