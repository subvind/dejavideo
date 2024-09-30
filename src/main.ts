import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { CustomLogger } from './logger/custom-logger';
import { resolve } from 'path';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

async function bootstrap(logger: CustomLogger) {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { logger });

  app.useStaticAssets(resolve('./src/public'));
  app.setBaseViewsDir(resolve('./src/views'));
  app.setViewEngine('ejs');

  app.use(cookieParser());

  // so browsers can use api
  app.enableCors({
    origin: '*',
  });
  
  await app.listen(3000);
}

const logger = new CustomLogger('Bootstrap');

bootstrap(logger);