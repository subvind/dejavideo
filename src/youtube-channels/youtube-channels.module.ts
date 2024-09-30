import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { YoutubeChannel } from './youtube-channel.entity';
import { YoutubeChannelsService } from './youtube-channels.service';
import { YoutubeChannelsController } from './youtube-channels.controller';

@Module({
  imports: [TypeOrmModule.forFeature([YoutubeChannel])],
  providers: [YoutubeChannelsService],
  controllers: [YoutubeChannelsController],
  exports: [YoutubeChannelsService],
})
export class YoutubeChannelsModule {}