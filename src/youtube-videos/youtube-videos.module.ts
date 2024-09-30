import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { YoutubeVideo } from './youtube-video.entity';
import { YoutubeVideosService } from './youtube-videos.service';
import { YoutubeVideosController } from './youtube-videos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([YoutubeVideo])],
  providers: [YoutubeVideosService],
  controllers: [YoutubeVideosController],
  exports: [YoutubeVideosService],
})
export class YoutubeVideosModule {}