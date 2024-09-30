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
}
