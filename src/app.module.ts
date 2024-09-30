import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { YoutubePlaylistModule } from './youtube-playlist/youtube-playlist.module';
import { YoutubeChannelsModule } from './youtube-channels/youtube-channels.module';
import { YoutubeVideosModule } from './youtube-videos/youtube-videos.module';
import { VideoTimelineModule } from './video-timeline/video-timeline.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'data/dejavideo.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    YoutubePlaylistModule,
    YoutubeChannelsModule,
    YoutubeVideosModule,
    VideoTimelineModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}