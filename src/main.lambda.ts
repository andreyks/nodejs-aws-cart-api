import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Handler, Context, Callback } from 'aws-lambda';
import serverlessHttp from 'serverless-http';
import helmet from 'helmet';

let server: Handler;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (req, callback) => callback(null, true),
  });
  app.use(helmet());

  await app.init();
  return serverlessHttp(app.getHttpAdapter().getInstance());
}

export const handler: Handler = async (event: any, context: Context, callback: Callback) => {
  try {
    if (!server) {
      console.log('Bootstraping NestJS application...');
      server = await bootstrap();
    }
    return server(event, context, callback);
  } catch (error) {
    console.log('Request error:', error);
    throw(error);
  }
};
