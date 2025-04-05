import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Handler, Context } from 'aws-lambda';
import serverlessHttp from 'serverless-http';

let server: Handler;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.init();
  return serverlessHttp(app.getHttpAdapter().getInstance());
}

export const handler: Handler = async (event: any, context: Context, callback) => {
  if (!server) {
    server = await bootstrap();
  }
  // const callbackServer = () =>  {console.log("callback")}
  return server(event, context, callback);
};
