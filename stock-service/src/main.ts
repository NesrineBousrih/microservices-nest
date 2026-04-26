import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
  options: {
      package: 'stock',
      protoPath: join(__dirname, '../src/proto/stock.proto'),
      url: '0.0.0.0:5001',
    },
  });

  await app.listen();
  console.log('stock-service running on gRPC port 5001');
}
bootstrap();