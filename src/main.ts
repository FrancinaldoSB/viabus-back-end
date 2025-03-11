import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  morgan.token('body', (req: any) => JSON.stringify(req.body));
  app.use(morgan(':method :url :status :response-time ms - :body'));

  app.enableCors({
    origin: configService.getOrThrow('CORS_ORIGIN'),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  app.setGlobalPrefix('v1');

  const port = configService.get('PORT', process.env.PORT);
  await app.listen(port);
}
bootstrap();
