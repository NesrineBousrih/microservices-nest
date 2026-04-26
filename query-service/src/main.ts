import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3003);
  console.log('query-service running on http://localhost:3003');
  console.log('GraphQL playground at http://localhost:3003/graphql');
}
bootstrap();