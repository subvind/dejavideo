import { Logger, Controller, Get, Post, Render, Body, Param, Res, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  async root(@Req() req: Request) {
    const hello = this.appService.getHello();
    return { message: `isTrav & subVind: ${hello}` };
  }

  @Get('diskJockeys/timeline/:diskJockeyId')
  @Render('diskJockeys/timeline')
  async timeline(
    @Req() req: Request,
    @Param('diskJockeyId') diskJockeyId: string
  ) {
    return {
      diskJockeyId
    };
  }

  @Get('diskJockeys/queue/:diskJockeyId')
  @Render('diskJockeys/queue')
  async queue(
    @Req() req: Request,
    @Param('diskJockeyId') diskJockeyId: string
  ) {
    return {
      diskJockeyId
    };
  }
}
