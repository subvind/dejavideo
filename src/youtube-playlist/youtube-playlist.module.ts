import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { YoutubePlaylist } from './youtube-playlist.entity';
import { YoutubePlaylistService } from './youtube-playlist.service';
import { YoutubePlaylistController } from './youtube-playlist.controller';

@Module({
  imports: [TypeOrmModule.forFeature([YoutubePlaylist])],
  providers: [YoutubePlaylistService],
  controllers: [YoutubePlaylistController],
})
export class YoutubePlaylistModule {}