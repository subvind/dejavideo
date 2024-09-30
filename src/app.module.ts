import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { YoutubePlaylistModule } from './youtube-playlist/youtube-playlist.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'data/dejavideo.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    YoutubePlaylistModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}